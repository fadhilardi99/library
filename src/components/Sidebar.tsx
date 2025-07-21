// components/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Clock,
  Users,
  Settings,
  BarChart3,
  CheckSquare,
  X,
  ChevronDown,
  UserCheck,
  BookPlus,
} from "lucide-react";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ("ADMIN" | "MAHASISWA" | "DOSEN")[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    roles: ["ADMIN", "MAHASISWA", "DOSEN"],
  },
  {
    title: "Katalog Buku",
    href: "/books",
    icon: <BookOpen size={20} />,
    roles: ["ADMIN", "MAHASISWA", "DOSEN"],
  },
  {
    title: "Peminjaman",
    href: "/loans",
    icon: <Clock size={20} />,
    roles: ["ADMIN", "MAHASISWA", "DOSEN"],
    children: [
      {
        title: "Riwayat Pinjaman",
        href: "/loans/history",
        icon: <Clock size={18} />,
        roles: ["MAHASISWA", "DOSEN"],
      },
      {
        title: "Kelola Pinjaman",
        href: "/loans/manage",
        icon: <CheckSquare size={18} />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Favorit",
    href: "/favorites",
    icon: <Heart size={20} />,
    roles: ["MAHASISWA", "DOSEN"],
  },
  // Admin only
  {
    title: "Manajemen",
    href: "/admin",
    icon: <Settings size={20} />,
    roles: ["ADMIN"],
    children: [
      {
        title: "Kelola Buku",
        href: "/admin/books",
        icon: <BookPlus size={18} />,
        roles: ["ADMIN"],
      },
      {
        title: "Kelola Pengguna",
        href: "/admin/users",
        icon: <UserCheck size={18} />,
        roles: ["ADMIN"],
      },
      {
        title: "Laporan",
        href: "/admin/reports",
        icon: <BarChart3 size={18} />,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Pengaturan",
    href: "/profile",
    icon: <Settings size={20} />,
    roles: ["ADMIN", "MAHASISWA", "DOSEN"],
  },
];

export function Sidebar({ user, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/" + user.role.toLowerCase())
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const NavLink = ({
    item,
    isChild = false,
  }: {
    item: NavItem;
    isChild?: boolean;
  }) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);

    return (
      <div>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors",
              isChild ? "pl-12 py-2" : "",
              active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                isExpanded ? "rotate-180" : ""
              )}
            />
          </button>
        ) : (
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isChild ? "pl-12 py-2" : "",
              active
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={onClose}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item
              .children!.filter((child) => child.roles.includes(user.role))
              .map((child) => (
                <NavLink key={child.href} item={child} isChild />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredItems.map((item) => (
              <NavLink key={item.title} item={item} />
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
