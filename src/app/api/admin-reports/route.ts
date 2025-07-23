import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const year = parseInt(req.nextUrl.searchParams.get("year") || "");
    const month = parseInt(req.nextUrl.searchParams.get("month") || "");
    const where: Record<string, unknown> = {};
    if (!isNaN(year)) {
      where.borrowedAt = {
        gte: new Date(year, isNaN(month) ? 0 : month - 1, 1),
        lte: new Date(year, isNaN(month) ? 11 : month - 1, 31, 23, 59, 59),
      };
    }
    // Laporan peminjaman
    const totalLoans = await prisma.loan.count({ where });
    const returnedLoans = await prisma.loan.count({
      where: { ...where, status: "RETURNED" },
    });
    const overdueLoans = await prisma.loan.count({
      where: { ...where, status: "OVERDUE" },
    });
    // Buku terpopuler
    const popularBook = await prisma.book.findFirst({
      where: {},
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
      totalLoans,
      returnedLoans,
      overdueLoans,
      popularBook,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
