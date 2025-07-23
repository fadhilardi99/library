import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const settings = await prisma.systemSettings.findFirst();
    if (!settings)
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    const updated = await prisma.systemSettings.update({
      where: { id: settings.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
