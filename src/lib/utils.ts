// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateDueDate(
  loanDate: Date,
  userRole: "MAHASISWA" | "DOSEN" | "ADMIN"
) {
  const dueDate = new Date(loanDate);

  // Dosen bisa pinjam lebih lama (30 hari) vs Mahasiswa (14 hari)
  const days = userRole === "DOSEN" ? 30 : 14;
  dueDate.setDate(dueDate.getDate() + days);

  return dueDate;
}

export function isOverdue(dueDate: Date) {
  return new Date() > dueDate;
}

export function getDaysUntilDue(dueDate: Date) {
  const now = new Date();
  const timeDiff = dueDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateNIM(nim: string) {
  // Format: 4 digit tahun + 6 digit nomor
  const nimRegex = /^\d{10}$/;
  return nimRegex.test(nim);
}

export function validateNIP(nip: string) {
  // Format NIP: 18 digit
  const nipRegex = /^\d{18}$/;
  return nipRegex.test(nip);
}

export function maskIdentity(identity: string, type: "nim" | "nip") {
  if (!identity) return "";

  if (type === "nim") {
    // Mask middle part: 2021***001
    return identity.slice(0, 4) + "***" + identity.slice(-3);
  } else {
    // Mask middle part for NIP
    return identity.slice(0, 6) + "***" + identity.slice(-3);
  }
}

export function getInitials(name?: string) {
  if (!name || typeof name !== "string" || !name.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
