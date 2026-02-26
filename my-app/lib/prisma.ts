// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Use the global object for dev to prevent multiple instances
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}