// components/Sidebar.tsx
"use client";

import { User } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  Clock,
  BarChart3,
  Settings,
  BookPlus,
  Heart,
} from "lucide-react";

interface SidebarProps {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuByRole = {
  ADMIN: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Manajemen Buku",
      href: "/dashboard/admin/books",
      icon: <BookOpen size={20} />,
    },
    {
      title: "Manajemen User",
      href: "/dashboard/admin/users",
      icon: <Users size={20} />,
    },
    {
      title: "Persetujuan Peminjaman",
      href: "/dashboard/admin/loans/approval",
      icon: <CheckSquare size={20} />,
    },
    {
      title: "Pengembalian",
      href: "/dashboard/admin/returns",
      icon: <Clock size={20} />,
    },
    {
      title: "Statistik",
      href: "/dashboard/admin/stats",
      icon: <BarChart3 size={20} />,
    },
    {
      title: "Laporan",
      href: "/dashboard/admin/reports",
      icon: <BarChart3 size={20} />,
    },
    {
      title: "Pengaturan",
      href: "/dashboard/admin/settings",
      icon: <Settings size={20} />,
    },
    {
      title: "Import/Export Buku",
      href: "/dashboard/admin/books/import-export",
      icon: <BookPlus size={20} />,
    },
  ],
  MAHASISWA: [
    {
      title: "Dashboard",
      href: "/dashboard/mahasiswa",
      icon: <LayoutDashboard size={20} />,
    },
    { title: "Katalog Buku", href: "/books", icon: <BookOpen size={20} /> },
    { title: "Peminjaman", href: "/loans", icon: <Clock size={20} /> },
    { title: "Favorit", href: "/favorites", icon: <Heart size={20} /> },
    { title: "Pengaturan", href: "/profile", icon: <Settings size={20} /> },
  ],
  DOSEN: [
    {
      title: "Dashboard",
      href: "/dashboard/dosen",
      icon: <LayoutDashboard size={20} />,
    },
    { title: "Katalog Buku", href: "/books", icon: <BookOpen size={20} /> },
    { title: "Peminjaman", href: "/loans", icon: <Clock size={20} /> },
    { title: "Favorit", href: "/favorites", icon: <Heart size={20} /> },
    { title: "Pengaturan", href: "/profile", icon: <Settings size={20} /> },
  ],
};

export function Sidebar({ user, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const menu = menuByRole[user.role as keyof typeof menuByRole] || [];
  return (
    <>
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">Tutup</span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={onClose}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
          {/* Hapus user info di bawah sidebar */}
        </div>
      </aside>
    </>
  );
}
