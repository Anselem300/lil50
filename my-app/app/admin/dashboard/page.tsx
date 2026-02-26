import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminUpload from "./AdminUpload";
import { Role } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== Role.ADMIN) {
    redirect("/");
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Admin Dashboard
        </h1>

        <AdminUpload />

        {/* Slim Flat Home Link */}
        <div className="mt-8 text-center">
  <Link
    href="/"
    className="inline-block text-sm text-zinc-400 hover:text-white transition-colors duration-200"
  >
    ← Back to Home
  </Link>
</div>
      </div>
    </div>
  );
}