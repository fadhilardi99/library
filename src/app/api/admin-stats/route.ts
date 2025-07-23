import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalBooks = await prisma.book.count();
    const totalLoans = await prisma.loan.count();
    const totalActiveUsers = await prisma.user.count({
      where: { isActive: true },
    });
    // Buku paling favorit (paling banyak dipinjam)
    const favoriteBook = await prisma.book.findFirst({
      orderBy: {
        loans: { _count: "desc" },
      },
      select: {
        title: true,
        author: true,
        _count: { select: { loans: true } },
      },
    });
    return NextResponse.json({
      totalBooks,
      totalLoans,
      totalActiveUsers,
      favoriteBook,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
