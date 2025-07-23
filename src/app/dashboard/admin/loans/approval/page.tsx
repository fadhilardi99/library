"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LoanRequest {
  id: string;
  user: { firstName: string; lastName: string; email: string };
  book: { title: string; author: string };
  requestDate: string;
  status: string;
}

export default function LoanApprovalPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [modal, setModal] = useState<{
    id: string;
    action: "APPROVED" | "REJECTED";
  } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/loan-requests?status=PENDING")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data permintaan peminjaman");
        setLoading(false);
      });
  }, []);

  const refetchRequests = () => {
    setLoading(true);
    fetch("/api/loan-requests?status=PENDING")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data permintaan peminjaman");
        setLoading(false);
      });
  };

  const handleApprove = async (id: string) => {
    await fetch("/api/loan-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "APPROVED" }),
    });
    refetchRequests();
  };
  const handleReject = async (id: string) => {
    await fetch("/api/loan-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "REJECTED" }),
    });
    refetchRequests();
  };

  const handleAction = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      await fetch("/api/loan-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modal.id,
          status: modal.action,
          adminNotes,
        }),
      });
      toast({
        title: "Berhasil",
        description: `Permintaan berhasil ${
          modal.action === "APPROVED" ? "disetujui" : "ditolak"
        }.`,
      });
      setModal(null);
      setAdminNotes("");
      refetchRequests();
    } catch {
      toast({
        title: "Gagal",
        description: "Gagal memproses aksi.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Persetujuan Peminjaman Buku
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div>Tidak ada permintaan peminjaman.</div>
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
                  Tanggal Permintaan
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">
                    {req.user.firstName} {req.user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {req.user.email}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {req.book.title}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {req.book.author}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800 space-x-2">
                    <button
                      onClick={() =>
                        setModal({ id: req.id, action: "APPROVED" })
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() =>
                        setModal({ id: req.id, action: "REJECTED" })
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Catatan Admin */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              {modal.action === "APPROVED" ? "Setujui" : "Tolak"} Permintaan
            </h2>
            <label className="block mb-2 text-gray-800">
              Catatan Admin (opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full border px-3 py-2 rounded text-gray-800 mb-4"
              rows={3}
              placeholder="Tulis catatan untuk peminjam..."
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
                onClick={handleAction}
                className={
                  modal.action === "APPROVED"
                    ? "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    : "px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                }
                disabled={submitting}
              >
                {submitting
                  ? "Menyimpan..."
                  : modal.action === "APPROVED"
                  ? "Setujui"
                  : "Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
