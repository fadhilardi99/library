// src/app/dashboard/admin/books/page.tsx
"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Search, Edit, Trash2 } from "lucide-react";
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
  const [search, setSearch] = useState("");

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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

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
    if (!form.title || !form.author) {
      toast({
        title: "Validasi Gagal",
        description: "Judul dan penulis wajib diisi.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (editId) {
        const res = await fetch(`/api/books?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast({ title: "Berhasil", description: "Buku berhasil diubah." });
        refetchBooks();
      } else {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        toast({ title: "Berhasil", description: "Buku berhasil ditambahkan." });
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

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/books?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Berhasil", description: "Buku berhasil dihapus." });
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">Manajemen Buku</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-semibold"
        >
          <Plus size={20} /> Tambah Buku
        </button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-800 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-2xl">
                Judul
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Penulis
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Tahun
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Total Stok
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Stok Tersedia
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tr-2xl">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, i) => (
              <tr
                key={book.id}
                className={
                  i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50 hover:bg-blue-50 transition"
                }
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {book.title}
                </td>
                <td className="px-4 py-3 text-gray-700">{book.author}</td>
                <td className="px-4 py-3 text-gray-700">
                  {book.publishedYear}
                </td>
                <td className="px-4 py-3 text-gray-700">{book.totalCopies}</td>
                <td className="px-4 py-3 text-gray-700">
                  {book.availableCopies}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    onClick={() => handleOpenEdit(book)}
                    className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 shadow"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => setShowDelete(book.id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Form Tambah/Edit Buku */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl min-w-[320px] max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
              <BookOpen size={22} /> {editId ? "Edit Buku" : "Tambah Buku"}
            </h2>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Judul</label>
              <input
                name="title"
                value={form.title || ""}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded-xl text-gray-800"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Penulis</label>
              <input
                name="author"
                value={form.author || ""}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded-xl text-gray-800"
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
                className="w-full border px-3 py-2 rounded-xl text-gray-800"
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
                className="w-full border px-3 py-2 rounded-xl text-gray-800"
                min="1"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-gray-900">Kategori</label>
              <select
                name="category"
                value={form.category || "LAINNYA"}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded-xl text-gray-800"
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
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
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
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[320px] max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
              <Trash2 size={22} /> Konfirmasi Hapus
            </h2>
            <p className="text-gray-800 mb-4">
              Yakin ingin menghapus buku ini?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold"
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
