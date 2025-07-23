import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, role, isActive } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data: Partial<{ role: UserRole; isActive: boolean }> = {};
    if (role) data.role = role as UserRole;
    if (typeof isActive === "boolean") data.isActive = isActive;
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
