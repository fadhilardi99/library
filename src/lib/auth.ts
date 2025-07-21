// lib/auth.ts
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

export async function getCurrentUser(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function requireUser(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(allowedRoles: Role[], request: NextRequest) {
  const user = await requireUser(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export function getRoleRedirectPath(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "DOSEN":
      return "/dashboard/dosen";
    case "MAHASISWA":
      return "/dashboard/mahasiswa";
    default:
      return "/dashboard";
  }
}
