"use client";

import { useEffect, useState } from "react";
import {
  BarChart2,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";

interface Report {
  totalLoans: number;
  returnedLoans: number;
  overdueLoans: number;
  popularBook?: {
    title: string;
    author: string;
    _count: { loans: number };
  } | null;
}

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function AdminReportsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = () => {
    setLoading(true);
    fetch(`/api/admin-reports?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat laporan");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
  }, [year, month]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <BarChart2 size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">Laporan Peminjaman</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar size={20} className="text-gray-400" />
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-gray-800"
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-200 px-4 py-2 rounded-xl w-24 shadow-sm text-gray-800"
          min={2000}
          max={now.getFullYear()}
        />
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-semibold"
        >
          Tampilkan
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <BookOpen size={32} className="text-blue-600 mb-2" />
          <span className="text-gray-500 text-sm mb-2">Total Peminjaman</span>
          <span className="text-2xl font-bold text-blue-700">
            {loading ? "..." : report?.totalLoans ?? 0}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <CheckCircle size={32} className="text-green-600 mb-2" />
          <span className="text-gray-500 text-sm mb-2">Sudah Dikembalikan</span>
          <span className="text-2xl font-bold text-green-700">
            {loading ? "..." : report?.returnedLoans ?? 0}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <Clock size={32} className="text-red-600 mb-2" />
          <span className="text-gray-500 text-sm mb-2">Terlambat</span>
          <span className="text-2xl font-bold text-red-700">
            {loading ? "..." : report?.overdueLoans ?? 0}
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <Star size={32} className="text-yellow-500 mb-2" />
          <span className="text-gray-500 text-sm mb-2">Buku Terpopuler</span>
          {loading ? (
            <span className="text-gray-400">...</span>
          ) : report?.popularBook ? (
            <>
              <span className="text-lg font-semibold text-gray-900 text-center">
                {report.popularBook.title}
              </span>
              <span className="text-xs text-gray-500 mb-1">
                oleh {report.popularBook.author}
              </span>
              <span className="text-xs text-blue-700">
                {report.popularBook._count.loans}x dipinjam
              </span>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div>
    </div>
  );
}
