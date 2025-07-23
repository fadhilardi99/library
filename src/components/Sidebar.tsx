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
      icon: <LayoutDashboard size={24} />,
    },
    {
      title: "Manajemen Buku",
      href: "/dashboard/admin/books",
      icon: <BookOpen size={24} />,
    },
    {
      title: "Manajemen User",
      href: "/dashboard/admin/users",
      icon: <Users size={24} />,
    },
    {
      title: "Persetujuan Peminjaman",
      href: "/dashboard/admin/loans/approval",
      icon: <CheckSquare size={24} />,
    },
    {
      title: "Pengembalian",
      href: "/dashboard/admin/returns",
      icon: <Clock size={24} />,
    },
    {
      title: "Statistik",
      href: "/dashboard/admin/stats",
      icon: <BarChart3 size={24} />,
    },
    {
      title: "Laporan",
      href: "/dashboard/admin/reports",
      icon: <BarChart3 size={24} />,
    },
    {
      title: "Pengaturan",
      href: "/dashboard/admin/settings",
      icon: <Settings size={24} />,
    },
    {
      title: "Import/Export Buku",
      href: "/dashboard/admin/books/import-export",
      icon: <BookPlus size={24} />,
    },
  ],
  MAHASISWA: [
    {
      title: "Dashboard",
      href: "/dashboard/mahasiswa",
      icon: <LayoutDashboard size={24} />,
    },
    { title: "Katalog Buku", href: "/books", icon: <BookOpen size={24} /> },
    { title: "Peminjaman", href: "/loans", icon: <Clock size={24} /> },
    { title: "Favorit", href: "/favorites", icon: <Heart size={24} /> },
    { title: "Pengaturan", href: "/profile", icon: <Settings size={24} /> },
  ],
  DOSEN: [
    {
      title: "Dashboard",
      href: "/dashboard/dosen",
      icon: <LayoutDashboard size={24} />,
    },
    { title: "Katalog Buku", href: "/books", icon: <BookOpen size={24} /> },
    { title: "Peminjaman", href: "/loans", icon: <Clock size={24} /> },
    { title: "Favorit", href: "/favorites", icon: <Heart size={24} /> },
    { title: "Pengaturan", href: "/profile", icon: <Settings size={24} /> },
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
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl rounded-r-3xl border-r border-gray-100 transition-transform duration-300 flex flex-col lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-100 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="text-white" size={28} />
            </div>
            <span className="text-xl font-bold text-blue-700 tracking-wide">
              Perpustakaan Digital
            </span>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
            {menu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-base transition-colors",
                  pathname === item.href
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                )}
                onClick={onClose}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
