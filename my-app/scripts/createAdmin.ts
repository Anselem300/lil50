import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("oluebube123", 10);

  await prisma.user.create({
    data: {
      name: "Prosper",
      email: "sprosper151@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created");
}

main();