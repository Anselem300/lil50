import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Singleton pattern for Prisma (prevents too many connections in dev)
let prisma: PrismaClient;
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}
prisma = globalThis.prisma;

export async function GET(req: NextRequest) {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        coverUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ songs });
  } catch (err) {
    console.error("Error fetching songs from DB:", err);
    return NextResponse.json({ songs: [] }, { status: 500 });
  }
}