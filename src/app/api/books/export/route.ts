import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stringify } from "csv-stringify/sync";
import { write, utils } from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const format = req.nextUrl.searchParams.get("format") || "csv";
    const books = await prisma.book.findMany();
    if (format === "json") {
      return new NextResponse(JSON.stringify(books), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=books.json",
        },
      });
    } else if (format === "xlsx") {
      const ws = utils.json_to_sheet(books);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Books");
      const buf = write(wb, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(buf, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": "attachment; filename=books.xlsx",
        },
      });
    } else {
      // Default CSV
      const csv = stringify(books, { header: true });
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=books.csv",
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export books" },
      { status: 500 }
    );
  }
}
