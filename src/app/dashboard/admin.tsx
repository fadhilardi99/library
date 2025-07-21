"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Misal role disimpan di publicMetadata
      const role = user.publicMetadata?.role;
      if (role !== "ADMIN") {
        router.replace("/dashboard"); // Atau ke halaman lain sesuai kebutuhan
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Konten admin */}
    </div>
  );
}
