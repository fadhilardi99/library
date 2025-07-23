// components/Navbar.tsx
"use client";

import { User } from "@prisma/client";
import { Menu, Book } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

interface NavbarProps {
  user: User;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({
  user,
  onMenuToggle,
  showMenuButton = true,
}: NavbarProps) {
  // Label dashboard sesuai role
  const roleLabel =
    user.role === "ADMIN"
      ? "Admin"
      : user.role === "DOSEN"
      ? "Dosen"
      : user.role === "MAHASISWA"
      ? "Mahasiswa"
      : "Dashboard";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {showMenuButton && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="bg-blue-600 p-2 rounded-lg">
              <Book className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              {roleLabel}
            </span>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    </nav>
  );
}
