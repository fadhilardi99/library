// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { User } from "@prisma/client";
import { useRouter, usePathname } from "next/navigation";

// This would typically come from your database
// For demo purposes, we'll simulate the user data
const mockUser: User = {
  id: "1",
  clerkId: "user_clerk_id",
  email: "user@kampus.edu",
  name: "John Doe",
  role: "MAHASISWA",
  nim: "2021001001",
  nip: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    // In a real app, you'd fetch the user data from your database
    // based on clerkUser.id
    if (isLoaded && clerkUser) {
      setUser({
        ...mockUser,
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        name: clerkUser.fullName || clerkUser.firstName || "User",
      });
    }
  }, [isLoaded, clerkUser]);

  useEffect(() => {
    if (user) {
      const expectedPath = "/dashboard/" + user.role.toLowerCase();
      if (pathname !== expectedPath) {
        router.replace(expectedPath);
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
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
