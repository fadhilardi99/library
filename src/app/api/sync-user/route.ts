import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    console.error("Unauthorized: userId tidak ditemukan");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user data from Clerk API
  const userRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });
  if (!userRes.ok) {
    const errText = await userRes.text();
    console.error("Gagal fetch Clerk user:", errText);
    return NextResponse.json(
      { error: "Failed to fetch Clerk user" },
      { status: 500 }
    );
  }
  const user = await userRes.json();

  const now = new Date().toISOString();

  const { data, error } = await supabase.from("users").upsert(
    [
      {
        id: user.id,
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address,
        firstName: user.first_name,
        lastName: user.last_name || "",
        updatedAt: now,
        createdAt: now, // opsional, untuk data baru
        // Tambahkan field lain sesuai schema jika perlu
      },
    ],
    { onConflict: "clerkId" }
  );

  if (error) {
    console.error("Gagal upsert ke Supabase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data?.[0] });
}
