import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Ambil data user dari database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Redirect sesuai role
  if (user.role === "MAHASISWA") {
    redirect("/dashboard/mahasiswa");
  } else if (user.role === "DOSEN") {
    redirect("/dashboard/dosen");
  } else if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/sign-in");
  }

  return null;
}
