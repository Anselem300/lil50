import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Simple Prisma client instance (like your videos route)
const prisma = new PrismaClient();

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
    console.error("Error fetching songs:", err);
    return NextResponse.json({ songs: [] }, { status: 500 });
  }
}