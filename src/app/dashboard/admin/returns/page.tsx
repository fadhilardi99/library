"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Undo2, StickyNote } from "lucide-react";

interface Loan {
  id: string;
  user: { firstName: string; lastName: string; email: string };
  book: { title: string; author: string };
  borrowedAt: string;
  dueDate: string;
  status: string;
}

export default function ReturnsPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/loans?status=ACTIVE")
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data peminjaman aktif");
        setLoading(false);
      });
  }, []);

  const refetchLoans = () => {
    setLoading(true);
    fetch("/api/loans?status=ACTIVE")
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data peminjaman aktif");
        setLoading(false);
      });
  };

  const handleReturn = (id: string) => {
    setModal(id);
  };

  const handleSubmitReturn = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      await fetch("/api/loans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modal, notes: adminNotes }),
      });
      toast({
        title: "Berhasil",
        description: "Pengembalian berhasil diproses.",
      });
      setModal(null);
      setAdminNotes("");
      refetchLoans();
    } catch {
      toast({
        title: "Gagal",
        description: "Gagal memproses pengembalian.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <Undo2 size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">Pengembalian Buku</h1>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-2xl">
                Nama Peminjam
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Judul Buku
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Penulis
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Tanggal Pinjam
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Batas Kembali
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tr-2xl">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, i) => (
              <tr
                key={loan.id}
                className={
                  i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50 hover:bg-blue-50 transition"
                }
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {loan.user.firstName} {loan.user.lastName}
                </td>
                <td className="px-4 py-3 text-gray-700">{loan.user.email}</td>
                <td className="px-4 py-3 text-gray-700">{loan.book.title}</td>
                <td className="px-4 py-3 text-gray-700">{loan.book.author}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(loan.borrowedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(loan.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 shadow"
                  >
                    <Undo2 size={16} /> Tandai Dikembalikan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Catatan Admin Pengembalian */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[320px] max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
              <StickyNote size={22} /> Catatan Pengembalian
            </h2>
            <label className="block mb-2 text-gray-800">
              Catatan Admin (opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full border px-3 py-2 rounded-xl text-gray-800 mb-4"
              rows={3}
              placeholder="Tulis catatan pengembalian..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModal(null);
                  setAdminNotes("");
                }}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReturn}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
