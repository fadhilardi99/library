"use client";

import { useEffect, useState } from "react";

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Statistik Perpustakaan
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Total Buku</span>
            <span className="text-2xl font-bold text-blue-700">
              {stats.totalBooks}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Total Peminjaman</span>
            <span className="text-2xl font-bold text-blue-700">
              {stats.totalLoans}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Pengguna Aktif</span>
            <span className="text-2xl font-bold text-blue-700">
              {stats.totalActiveUsers}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Buku Favorit</span>
            {stats.favoriteBook ? (
              <>
                <span className="text-lg font-semibold text-gray-900 text-center">
                  {stats.favoriteBook.title}
                </span>
                <span className="text-xs text-gray-500 mb-1">
                  oleh {stats.favoriteBook.author}
                </span>
                <span className="text-xs text-blue-700">
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
