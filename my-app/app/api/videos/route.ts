import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}