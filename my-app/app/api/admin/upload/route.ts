import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // ✅ Proper enum comparison
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const cover = formData.get("cover") as File | null; // ✅ cover file
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const type = formData.get("type") as "song" | "video" | null;

  if (!file || !title || !type) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // If song, require cover
  if (type === "song" && !cover) {
    return NextResponse.json(
      { error: "Cover image is required for songs" },
      { status: 400 }
    );
  }

  const userId = parseInt(session.user.id);
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid user session" },
      { status: 401 }
    );
  }

  // ===============================
  // Upload main media file
  // ===============================

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadMedia = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // works for video + audio
          folder: type === "song" ? "songs" : "videos",
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string });
        }
      );
      stream.end(fileBuffer);
    }
  );

  let coverUrl: string | null = null;

  // ===============================
  // Upload cover image (songs only)
  // ===============================

  if (type === "song" && cover) {
    const coverBuffer = Buffer.from(await cover.arrayBuffer());

    const uploadCover = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "song-covers",
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result as { secure_url: string });
          }
        );
        stream.end(coverBuffer);
      }
    );

    coverUrl = uploadCover.secure_url;
  }

  // ===============================
  // Save to database
  // ===============================

  if (type === "song") {
    await prisma.song.create({
      data: {
        title,
        description: description ?? "",
        fileUrl: uploadMedia.secure_url,
        coverUrl, // ✅ make sure your Prisma model has this field
        userId,
      },
    });
  } else {
    await prisma.video.create({
      data: {
        title,
        description: description ?? "",
        fileUrl: uploadMedia.secure_url,
        userId,
      },
    });
  }

  return NextResponse.json({ success: true });
}