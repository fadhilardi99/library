"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

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

const categories = [
  "TEKNOLOGI",
  "BISNIS",
  "SASTRA",
  "SEJARAH",
  "SAINS",
  "MATEMATIKA",
  "EKONOMI",
  "HUKUM",
  "PSIKOLOGI",
  "FILSAFAT",
  "AGAMA",
  "SENI",
  "OLAHRAGA",
  "KESEHATAN",
  "PENDIDIKAN",
  "LAINNYA",
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      (book.category || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? book.category === category : true;
    return matchSearch && matchCategory;
  });

  const handleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Katalog Buku</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari judul, penulis, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : filteredBooks.length === 0 ? (
        <div>Tidak ada buku.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-1">oleh {book.author}</p>
                <p className="text-gray-500 text-xs mb-2">
                  {book.publisher} • {book.publishedYear}
                </p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {book.category}
                </span>
                {book.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {book.description}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.availableCopies && book.availableCopies > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.availableCopies && book.availableCopies > 0
                    ? `${book.availableCopies} tersedia`
                    : "Tidak tersedia"}
                </span>
                <Link
                  href={`/books/${book.id}`}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  Detail
                </Link>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                  disabled={!book.availableCopies || book.availableCopies < 1}
                  onClick={() => alert("Fitur pinjam coming soon!")}
                >
                  Pinjam
                </button>
                <button
                  onClick={() => handleFavorite(book.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(book.id)
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                  aria-label="Favorit"
                >
                  <Heart
                    size={16}
                    fill={favorites.includes(book.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
