"use client";

import { useEffect, useState } from "react";

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Laporan Peminjaman
      </h1>
      <div className="flex gap-4 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-3 py-2 rounded w-24"
          min={2000}
          max={now.getFullYear()}
        />
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tampilkan
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : report ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Total Peminjaman</span>
            <span className="text-2xl font-bold text-blue-700">
              {report.totalLoans}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">
              Sudah Dikembalikan
            </span>
            <span className="text-2xl font-bold text-green-700">
              {report.returnedLoans}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Terlambat</span>
            <span className="text-2xl font-bold text-red-700">
              {report.overdueLoans}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500 text-sm mb-2">Buku Terpopuler</span>
            {report.popularBook ? (
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
      ) : null}
    </div>
  );
}
