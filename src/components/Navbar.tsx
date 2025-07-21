// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Search, Menu, X, Bell, Book } from "lucide-react";
import { User } from "@prisma/client";
import { getInitials } from "@/lib/utils";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Book className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Perpustakaan
                </h1>
                <p className="text-xs text-gray-500">Kampus Digital</p>
              </div>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari buku, penulis, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/books/search?q=${encodeURIComponent(
                      searchQuery.trim()
                    )}`;
                  }
                }}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role.toLowerCase()}
                    {user.role === "MAHASISWA" && user.nim && ` • ${user.nim}`}
                    {user.role === "DOSEN" && user.nip && ` • ${user.nip}`}
                  </p>
                </div>
              </div>

              {/* Clerk User Button */}
              <UserButton
                afterSignOutUrl="/auth/sign-in"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "shadow-lg border",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="lg:hidden border-t border-gray-200 px-4 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari buku..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-2.5"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
