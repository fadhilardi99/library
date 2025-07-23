"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Pengembalian Buku
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : loans.length === 0 ? (
        <div>Tidak ada peminjaman aktif.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Nama Peminjam
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Judul Buku
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Penulis
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Tanggal Pinjam
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Batas Kembali
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">
                    {loan.user.firstName} {loan.user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {loan.user.email}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {loan.book.title}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {loan.book.author}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {new Date(loan.borrowedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Tandai Dikembalikan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Catatan Admin Pengembalian */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Catatan Pengembalian
            </h2>
            <label className="block mb-2 text-gray-800">
              Catatan Admin (opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full border px-3 py-2 rounded text-gray-800 mb-4"
              rows={3}
              placeholder="Tulis catatan pengembalian..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModal(null);
                  setAdminNotes("");
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReturn}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
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
