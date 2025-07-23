import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  const requests = await prisma.loanRequest.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      book: { select: { title: true, author: true } },
    },
    orderBy: { requestDate: "desc" },
  });
  return NextResponse.json(requests);
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, adminNotes } = await req.json();
    if (!id || !status)
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    const data: Record<string, unknown> = { status };
    if (typeof adminNotes === "string") data.adminNotes = adminNotes;
    const updated = await prisma.loanRequest.update({
      where: { id },
      data,
      include: { user: true, book: true },
    });
    // Buat notifikasi ke user
    if (status === "APPROVED" || status === "REJECTED") {
      await prisma.notification.create({
        data: {
          userId: updated.userId,
          title:
            status === "APPROVED"
              ? "Peminjaman Disetujui"
              : "Peminjaman Ditolak",
          message:
            status === "APPROVED"
              ? `Permintaan peminjaman buku \"${updated.book.title}\" telah disetujui.`
              : `Permintaan peminjaman buku \"${updated.book.title}\" ditolak.${
                  adminNotes ? " Catatan: " + adminNotes : ""
                }`,
          type: status === "APPROVED" ? "LOAN_APPROVED" : "LOAN_REJECTED",
          data: {},
        },
      });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update loan request" },
      { status: 500 }
    );
  }
}
