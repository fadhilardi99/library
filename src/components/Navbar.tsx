// components/Navbar.tsx
"use client";

import { User } from "@prisma/client";
import { Menu, Book, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

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
  const roleLabel =
    user.role === "ADMIN"
      ? "Admin"
      : user.role === "DOSEN"
      ? "Dosen"
      : user.role === "MAHASISWA"
      ? "Mahasiswa"
      : "Dashboard";

  // Dummy: daftar notifikasi
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Ada 2 buku yang perlu disetujui.", read: false },
    { id: 2, message: "Pengembalian buku oleh Mahasiswa A.", read: false },
    { id: 3, message: "Laporan bulanan sudah tersedia.", read: true },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Badge merah jika ada notifikasi belum dibaca
  const hasNotification = notifications.some((n) => !n.read);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  // Tandai semua notifikasi sudah dibaca saat dropdown dibuka
  useEffect(() => {
    if (notifOpen && hasNotification) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, [notifOpen]);

  return (
    <nav className="backdrop-blur bg-white/80 shadow-md border-b-2 border-blue-600 px-6 sm:px-12 py-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {showMenuButton && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-3 rounded-2xl text-blue-600 hover:bg-blue-100 transition lg:hidden border border-blue-100 shadow-sm"
            aria-label="Buka menu"
          >
            <Menu size={26} />
          </button>
        )}
        <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
          <Book className="text-white" size={32} />
        </div>
        <span className="text-2xl font-bold text-blue-700 tracking-wide hidden sm:block select-none">
          Perpustakaan Digital
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-base font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm text-blue-600 font-medium">{roleLabel}</span>
        </div>
        {/* Notifikasi */}
        <div className="relative">
          <button
            ref={bellRef}
            className="relative p-2 rounded-full hover:bg-blue-100 transition focus:outline-none"
            aria-label="Notifikasi"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={24} className="text-blue-600" />
            {hasNotification && !notifOpen && (
              <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
          {notifOpen && (
            <div
              ref={notifRef}
              className="absolute right-0 mt-2 w-80 max-w-xs bg-white rounded-xl shadow-lg border border-blue-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b font-semibold text-blue-700 bg-blue-50">
                Notifikasi
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-400 text-sm">
                    Tidak ada notifikasi.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 text-sm ${
                        n.read
                          ? "text-gray-600 bg-white"
                          : "text-blue-900 bg-blue-50"
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: { avatarBox: "w-12 h-12 ring-2 ring-blue-400" },
          }}
        />
      </div>
    </nav>
  );
}
