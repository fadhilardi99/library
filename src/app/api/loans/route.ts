import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  const loans = await prisma.loan.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      book: { select: { title: true, author: true } },
    },
    orderBy: { borrowedAt: "desc" },
  });
  return NextResponse.json(loans);
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // Update status loan dan simpan notes
    const updated = await prisma.loan.update({
      where: { id },
      data: { status: "RETURNED", returnedAt: new Date(), notes },
      include: { book: true, user: true },
    });
    // Update availableCopies buku
    await prisma.book.update({
      where: { id: updated.bookId },
      data: { availableCopies: { increment: 1 } },
    });
    // Buat notifikasi ke user
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: "Pengembalian Buku",
        message: `Buku \"${updated.book.title}\" telah dikembalikan. ${
          notes ? "Catatan admin: " + notes : ""
        }`,
        type: "LOAN_RETURNED",
        data: {},
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update loan" },
      { status: 500 }
    );
  }
}
