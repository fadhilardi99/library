"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookCheck, XCircle, StickyNote } from "lucide-react";

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
      <div className="flex items-center gap-3 mb-8">
        <BookCheck size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">
          Persetujuan Peminjaman Buku
        </h1>
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
                Tanggal Permintaan
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tr-2xl">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr
                key={req.id}
                className={
                  i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50 hover:bg-blue-50 transition"
                }
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {req.user.firstName} {req.user.lastName}
                </td>
                <td className="px-4 py-3 text-gray-700">{req.user.email}</td>
                <td className="px-4 py-3 text-gray-700">{req.book.title}</td>
                <td className="px-4 py-3 text-gray-700">{req.book.author}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(req.requestDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    onClick={() => setModal({ id: req.id, action: "APPROVED" })}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 shadow"
                  >
                    <BookCheck size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => setModal({ id: req.id, action: "REJECTED" })}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow"
                  >
                    <XCircle size={16} /> Tolak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Catatan Admin */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[320px] max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
              <StickyNote size={22} />{" "}
              {modal.action === "APPROVED" ? "Setujui" : "Tolak"} Permintaan
            </h2>
            <label className="block mb-2 text-gray-800">
              Catatan Admin (opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full border px-3 py-2 rounded-xl text-gray-800 mb-4"
              rows={3}
              placeholder="Tulis catatan untuk peminjam..."
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
                onClick={handleAction}
                className={
                  modal.action === "APPROVED"
                    ? "px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold"
                    : "px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold"
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
