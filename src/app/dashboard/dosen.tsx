"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DosenDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role;
      if (role !== "DOSEN") {
        router.replace("/dashboard");
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div>
      <h1>Dosen Dashboard</h1>
      {/* Konten dosen */}
    </div>
  );
}
