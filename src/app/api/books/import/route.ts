import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parse as parseCSV } from "csv-parse/sync";
import { read, utils } from "xlsx";
import { Category } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const body = await req.arrayBuffer();
    let books: Array<Record<string, unknown>> = [];
    if (contentType.includes("application/json")) {
      books = JSON.parse(Buffer.from(body).toString());
    } else if (contentType.includes("text/csv")) {
      books = parseCSV(Buffer.from(body).toString(), { columns: true });
    } else if (
      contentType.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      const wb = read(Buffer.from(body), { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      books = utils.sheet_to_json(ws);
    } else {
      return NextResponse.json(
        { error: "Format file tidak didukung" },
        { status: 400 }
      );
    }
    let imported = 0;
    for (const book of books) {
      // Build data object with required fields
      const data = {
        title: String(book.title ?? ""),
        author: String(book.author ?? ""),
        publisher: String(book.publisher ?? ""),
        publishedYear: Number(book.publishedYear ?? 0),
        category: (Object.values(Category) as string[]).includes(
          String(book.category)
        )
          ? (book.category as Category)
          : "LAINNYA",
        isbn: book.isbn ? String(book.isbn) : undefined,
        description: book.description ? String(book.description) : undefined,
        coverImage: book.coverImage ? String(book.coverImage) : undefined,
        totalCopies: book.totalCopies ? Number(book.totalCopies) : 1,
        availableCopies: book.availableCopies
          ? Number(book.availableCopies)
          : 1,
        location: book.location ? String(book.location) : undefined,
        language: book.language ? String(book.language) : undefined,
        pages: book.pages ? Number(book.pages) : undefined,
        isActive: typeof book.isActive === "boolean" ? book.isActive : true,
      };
      // Gunakan ISBN sebagai unique key jika ada, jika tidak pakai id
      const where = data.isbn
        ? { isbn: data.isbn }
        : book.id
        ? { id: String(book.id) }
        : null;
      if (
        where &&
        data.title &&
        data.author &&
        data.publisher &&
        data.publishedYear &&
        data.category
      ) {
        const existing = await prisma.book.findFirst({ where });
        if (existing) {
          await prisma.book.update({ where: { id: existing.id }, data });
        } else {
          await prisma.book.create({ data });
        }
        imported++;
      }
    }
    return NextResponse.json({ success: true, imported });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to import books" },
      { status: 500 }
    );
  }
}
