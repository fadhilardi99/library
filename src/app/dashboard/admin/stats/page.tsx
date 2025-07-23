"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, BarChart3, Star } from "lucide-react";

interface Stats {
  totalBooks: number;
  totalLoans: number;
  totalActiveUsers: number;
  favoriteBook?: {
    title: string;
    author: string;
    _count: { loans: number };
  } | null;
}

const statCards = [
  {
    key: "totalBooks",
    label: "Total Buku",
    icon: <BookOpen size={32} className="text-blue-500" />,
    color: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    key: "totalLoans",
    label: "Total Peminjaman",
    icon: <BarChart3 size={32} className="text-green-500" />,
    color: "bg-green-50",
    text: "text-green-700",
  },
  {
    key: "totalActiveUsers",
    label: "Pengguna Aktif",
    icon: <Users size={32} className="text-purple-500" />,
    color: "bg-purple-50",
    text: "text-purple-700",
  },
];

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat statistik");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Statistik Perpustakaan
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {statCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-2xl shadow-md p-6 flex flex-col items-center justify-center ${card.color}`}
            >
              {card.icon}
              <span className="text-lg font-semibold text-gray-700 mt-2 mb-1">
                {card.label}
              </span>
              <span className={`text-3xl font-bold ${card.text}`}>
                {Number.isFinite(stats[card.key as keyof Stats])
                  ? Number(stats[card.key as keyof Stats])
                  : "-"}
              </span>
            </div>
          ))}
          <div className="rounded-2xl shadow-md p-6 flex flex-col items-center justify-center bg-yellow-50">
            <Star size={32} className="text-yellow-500" />
            <span className="text-lg font-semibold text-gray-700 mt-2 mb-1">
              Buku Favorit
            </span>
            {stats.favoriteBook ? (
              <>
                <span className="text-base font-bold text-yellow-700 text-center">
                  {stats.favoriteBook.title}
                </span>
                <span className="text-xs text-gray-500 mb-1">
                  oleh {stats.favoriteBook.author}
                </span>
                <span className="text-xs text-yellow-700">
                  {stats.favoriteBook._count.loans}x dipinjam
                </span>
              </>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
