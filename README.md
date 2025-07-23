# Perpustakaan Digital - Next.js App

A modern library management system built with Next.js, Prisma, Clerk authentication, and a fully redesigned admin dashboard.

## 🚀 Features

- **Role-based Dashboard:**
  - Admin, Dosen, Mahasiswa, each with their own sidebar and dashboard.
- **Manajemen Buku:** CRUD, import/export (CSV, Excel, JSON), preview before import.
- **Manajemen User:** Ubah role, status aktif, search, filter, delete.
- **Peminjaman & Pengembalian:** Approve/reject, admin notes, return marking, notifications.
- **Statistik & Laporan:** Card grid, monthly/yearly reports, favorite book highlight.
- **Pengaturan Sistem:** Batas peminjaman, denda, reminder, dsb.
- **Modern UI:**
  - Redesigned sidebar, navbar, dashboard, and all admin pages.
  - Responsive, clean, and accessible.
- **Notifikasi:**
  - Bell icon with dropdown, badge for unread notifications.
- **Toast Notifications:**
  - Success/error feedback for all actions.
- **Validation:**
  - All forms and import/export have validation and error handling.

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Setup environment:**
   - Add your Clerk API key as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`.
   - Setup your database and update `prisma/schema.prisma` as needed.
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Authentication

- Uses [Clerk](https://clerk.com/) for authentication and user management.
- See Clerk docs for setup and environment variables.

## 📦 Import/Export Buku

- Import/export book data in CSV, Excel, or JSON format.
- Preview data before import.
- Validation and error feedback included.

## 📊 Statistik & Laporan

- Dashboard cards for total books, loans, active users, and favorite book.
- Monthly/yearly reports with filters.

## 🖥️ Modern UI/UX

- Sidebar and navbar with role-based menus and user info.
- Notification dropdown with badge.
- Consistent color, spacing, and responsive design.

## 📚 Tech Stack

- Next.js App Router
- Prisma ORM
- Clerk Auth
- Tailwind CSS
- React Hooks

## 📄 License

MIT
