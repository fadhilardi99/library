// components/LoanCard.tsx
import { Loan, Book, User, LoanStatus } from "@prisma/client";
import { Calendar, Clock, User as UserIcon, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LoanCardProps {
  loan: Loan & {
    book: Book;
    user?: User;
  };
  showUser?: boolean;
  showActions?: boolean;
  onApprove?: (loanId: string) => void;
  onReject?: (loanId: string) => void;
  onReturn?: (loanId: string) => void;
}

export function LoanCard({
  loan,
  showUser = false,
  showActions = false,
  onApprove,
  onReject,
  onReturn,
}: LoanCardProps) {
  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "BORROWED":
        return "bg-green-100 text-green-800";
      case "RETURNED":
        return "bg-gray-100 text-gray-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: LoanStatus) => {
    switch (status) {
      case "PENDING":
        return "Menunggu Persetujuan";
      case "APPROVED":
        return "Disetujui";
      case "BORROWED":
        return "Dipinjam";
      case "RETURNED":
        return "Dikembalikan";
      case "REJECTED":
        return "Ditolak";
      case "OVERDUE":
        return "Terlambat";
      default:
        return status;
    }
  };

  const isOverdue = loan.status === "BORROWED" && new Date() > loan.dueDate;
  const daysUntilDue = Math.ceil(
    (loan.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {loan.book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">oleh {loan.book.author}</p>

          {showUser && loan.user && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <UserIcon size={16} />
              <span>{loan.user.name}</span>
              <span className="text-gray-400">•</span>
              <span>
                {loan.user.role === "MAHASISWA" ? loan.user.nim : loan.user.nip}
              </span>
            </div>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            loan.status
          )}`}
        >
          {getStatusText(loan.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <div>
            <p className="font-medium">Tanggal Pinjam</p>
            <p>{formatDate(loan.loanDate)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <div>
            <p className="font-medium">Batas Kembali</p>
            <p className={isOverdue ? "text-red-600 font-medium" : ""}>
              {formatDate(loan.dueDate)}
            </p>
            {loan.status === "BORROWED" && (
              <p
                className={`text-xs ${
                  isOverdue ? "text-red-600" : "text-gray-500"
                }`}
              >
                {isOverdue
                  ? `Terlambat ${Math.abs(daysUntilDue)} hari`
                  : `${daysUntilDue} hari lagi`}
              </p>
            )}
          </div>
        </div>

        {loan.returnDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen size={16} />
            <div>
              <p className="font-medium">Tanggal Kembali</p>
              <p>{formatDate(loan.returnDate)}</p>
            </div>
          </div>
        )}
      </div>

      {loan.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Catatan:</span> {loan.notes}
          </p>
        </div>
      )}

      {/* Admin Actions */}
      {showActions && loan.status === "PENDING" && (
        <div className="flex gap-2 pt-4 border-t">
          {onApprove && (
            <button
              onClick={() => onApprove(loan.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Setujui
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(loan.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Tolak
            </button>
          )}
        </div>
      )}

      {showActions && loan.status === "BORROWED" && (
        <div className="flex gap-2 pt-4 border-t">
          {onReturn && (
            <button
              onClick={() => onReturn(loan.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Tandai Dikembalikan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
