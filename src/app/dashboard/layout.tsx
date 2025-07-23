// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { User } from "@prisma/client";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: clerkUser, isLoaded } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => {
          console.log("/api/me response:", data);
          if (data && !data.error) {
            setUser(data);
            console.log("User set in layout:", data);
          } else setUser(null);
        })
        .catch(() => setUser(null));
    }
  }, [isLoaded, clerkUser]);

  useEffect(() => {
    if (user) {
      let expectedPath = "/dashboard/" + user.role.toLowerCase();
      if (user.role === "ADMIN") expectedPath = "/dashboard/admin";
      // Redirect hanya jika di root dashboard
      if (
        pathname === "/dashboard" ||
        pathname === "/dashboard/admin" ||
        pathname === "/dashboard/mahasiswa" ||
        pathname === "/dashboard/dosen"
      ) {
        if (pathname !== expectedPath) {
          router.replace(expectedPath);
        }
      }
    }
  }, [user, pathname, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Mengatur akun Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
