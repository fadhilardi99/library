// src/app/dashboard/admin/books/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  category?: string;
  description?: string;
  coverImage?: string;
  totalCopies?: number;
  availableCopies?: number;
  location?: string;
  language?: string;
  pages?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const initialForm: Partial<Book> = {
  title: "",
  author: "",
  publishedYear: new Date().getFullYear(),
  totalCopies: 1,
  availableCopies: 1,
  category: "LAINNYA",
};

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Book>>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch books from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data buku");
        setLoading(false);
      });
  }, []);

  // Helper untuk fetch ulang data buku
  const refetchBooks = () => {
    setLoading(true);
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data buku");
        setLoading(false);
      });
  };

  const handleOpenAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (book: Book) => {
    setForm({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      category: book.category,
    });
    setEditId(book.id);
    setShowForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "publishedYear" ||
        name === "totalCopies" ||
        name === "availableCopies"
          ? Number(value)
          : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi form
    if (!form.title || !form.author) {
      toast({
        title: "Validasi Gagal",
        description: "Judul dan penulis wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    if (
      !form.publishedYear ||
      form.publishedYear < 1900 ||
      form.publishedYear > new Date().getFullYear()
    ) {
      toast({
        title: "Validasi Gagal",
        description: "Tahun terbit tidak valid.",
        variant: "destructive",
      });
      return;
    }
    if (!form.totalCopies || form.totalCopies < 1) {
      toast({
        title: "Validasi Gagal",
        description: "Stok buku minimal 1.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (editId) {
        // Update
        const res = await fetch(`/api/books?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast({
          title: "Berhasil",
          description: "Buku berhasil diubah.",
        });
        refetchBooks();
      } else {
        // Create
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast({
          title: "Berhasil",
          description: "Buku berhasil ditambahkan.",
        });
        refetchBooks();
      }
      setShowForm(false);
    } catch {
      setError("Gagal menyimpan data buku");
      toast({
        title: "Gagal",
        description: "Gagal menyimpan data buku.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/books?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({
        title: "Berhasil",
        description: "Buku berhasil dihapus.",
      });
      refetchBooks();
      setShowDelete(null);
    } catch {
      setError("Gagal menghapus buku");
      toast({
        title: "Gagal",
        description: "Gagal menghapus buku.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Buku</h1>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Buku
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Judul
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Penulis
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Tahun
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Total Stok
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Stok Tersedia
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">
                    {book.title}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {book.author}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {book.publishedYear}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {book.totalCopies}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {book.availableCopies}
                  </td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => handleOpenEdit(book)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDelete(book.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form Tambah/Edit Buku */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded-lg shadow-lg min-w-[320px]"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              {editId ? "Edit Buku" : "Tambah Buku"}
            </h2>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Judul</label>
              <input
                name="title"
                value={form.title || ""}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-800"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Penulis</label>
              <input
                name="author"
                value={form.author || ""}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-800"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Tahun</label>
              <input
                name="publishedYear"
                type="number"
                value={form.publishedYear || new Date().getFullYear()}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-800"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Stok</label>
              <input
                name="totalCopies"
                type="number"
                value={form.totalCopies || 1}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-800"
                min="1"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Kategori</label>
              <select
                name="category"
                value={form.category || "LAINNYA"}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded text-gray-800"
              >
                <option value="TEKNOLOGI">Teknologi</option>
                <option value="BISNIS">Bisnis</option>
                <option value="SASTRA">Sastra</option>
                <option value="SEJARAH">Sejarah</option>
                <option value="SAINS">Sains</option>
                <option value="MATEMATIKA">Matematika</option>
                <option value="EKONOMI">Ekonomi</option>
                <option value="HUKUM">Hukum</option>
                <option value="PSIKOLOGI">Psikologi</option>
                <option value="FILSAFAT">Filsafat</option>
                <option value="AGAMA">Agama</option>
                <option value="SENI">Seni</option>
                <option value="OLAHRAGA">Olahraga</option>
                <option value="KESEHATAN">Kesehatan</option>
                <option value="PENDIDIKAN">Pendidikan</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {submitting ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-800">Yakin ingin menghapus buku ini?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                disabled={submitting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {submitting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
