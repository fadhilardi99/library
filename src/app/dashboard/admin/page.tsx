"use client";

import {
  BookOpen,
  Users,
  BarChart3,
  Star,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboard() {
  // Dummy data statistik
  const stats = [
    {
      label: "Total Buku",
      value: 1200,
      icon: <BookOpen size={32} className="text-blue-500" />,
      color: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Total Peminjaman",
      value: 340,
      icon: <BarChart3 size={32} className="text-green-500" />,
      color: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Pengguna Aktif",
      value: 87,
      icon: <Users size={32} className="text-purple-500" />,
      color: "bg-purple-50",
      text: "text-purple-700",
    },
    {
      label: "Buku Favorit",
      value: {
        title: "Algoritma dan Struktur Data",
        author: "D. Supriadi",
        count: 42,
      },
      icon: <Star size={40} className="text-yellow-500 mb-2" />,
      color:
        "bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300",
      text: "text-yellow-700",
      isFavorite: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">
          Selamat Datang di Dashboard Perpustakaan
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {stats.map((item) =>
          item.isFavorite ? (
            <div
              key={item.label}
              className={`rounded-2xl shadow-md p-6 flex flex-col items-center justify-center ${item.color}`}
            >
              {item.icon}
              <span className="text-lg font-semibold text-yellow-800 mb-1">
                {item.label}
              </span>
              {item.value && typeof item.value === "object" ? (
                <>
                  <span className="text-xl font-bold text-yellow-700 text-center">
                    {item.value.title}
                  </span>
                  <span className="text-sm text-gray-500 mb-1">
                    oleh {item.value.author}
                  </span>
                  <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                    {item.value.count}x dipinjam
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Star size={32} className="text-yellow-300 mb-2" />
                  <span className="text-gray-400">Belum ada buku favorit</span>
                </div>
              )}
            </div>
          ) : (
            <div
              key={item.label}
              className={`rounded-2xl shadow-md p-6 flex flex-col items-center justify-center ${item.color}`}
            >
              {item.icon}
              <span className="text-lg font-semibold text-gray-700 mt-2 mb-1">
                {item.label}
              </span>
              <span className={`text-3xl font-bold ${item.text}`}>
                {typeof item.value === "number" ||
                typeof item.value === "string"
                  ? item.value
                  : "-"}
              </span>
            </div>
          )
        )}
      </div>
      {/* Konten admin lainnya bisa ditambahkan di sini */}
    </div>
  );
}
