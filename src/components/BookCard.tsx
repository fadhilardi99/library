// components/BookCard.tsx
import { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Heart, BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book & {
    _count?: {
      loans: number;
      favorites: number;
    };
  };
  showActions?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (bookId: string) => void;
  onRequestLoan?: (bookId: string) => void;
}

export function BookCard({
  book,
  showActions = true,
  isFavorite = false,
  onFavoriteToggle,
  onRequestLoan,
}: BookCardProps) {
  const isAvailable = book.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Book Cover */}
      <div className="relative h-48 bg-gray-100">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <BookOpen size={48} />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isAvailable ? `${book.stock} tersedia` : "Tidak tersedia"}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>

        <p className="text-gray-600 text-sm mb-1">oleh {book.author}</p>

        <p className="text-gray-500 text-xs mb-2">
          {book.publisher} • {book.year}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {book.category}
          </span>
          {book._count && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Heart size={12} />
              {book._count.favorites}
            </span>
          )}
        </div>

        {book.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {book.description}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between">
            <Link
              href={`/books/${book.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Lihat Detail
            </Link>

            <div className="flex gap-2">
              {onFavoriteToggle && (
                <button
                  onClick={() => onFavoriteToggle(book.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    size={16}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
              )}

              {onRequestLoan && isAvailable && (
                <button
                  onClick={() => onRequestLoan(book.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Pinjam
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
