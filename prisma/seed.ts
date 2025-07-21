// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        clerkId: "admin_clerk_id",
        email: "admin@kampus.edu",
        name: "Admin Perpustakaan",
        role: Role.ADMIN,
      },
    }),
    // Dosen
    prisma.user.create({
      data: {
        clerkId: "dosen1_clerk_id",
        email: "dosen1@kampus.edu",
        name: "Dr. Ahmad Setiawan",
        role: Role.DOSEN,
        nip: "198512012010011001",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "dosen2_clerk_id",
        email: "dosen2@kampus.edu",
        name: "Prof. Siti Rahayu",
        role: Role.DOSEN,
        nip: "197803152008012002",
      },
    }),
    // Mahasiswa
    prisma.user.create({
      data: {
        clerkId: "mahasiswa1_clerk_id",
        email: "mahasiswa1@kampus.edu",
        name: "Budi Santoso",
        role: Role.MAHASISWA,
        nim: "2021001001",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "mahasiswa2_clerk_id",
        email: "mahasiswa2@kampus.edu",
        name: "Sari Dewi",
        role: Role.MAHASISWA,
        nim: "2021001002",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "Algoritma dan Struktur Data",
        author: "Thomas H. Cormen",
        publisher: "MIT Press",
        year: 2022,
        isbn: "9780262046305",
        category: "Komputer",
        description:
          "Buku komprehensif tentang algoritma dan struktur data untuk mahasiswa ilmu komputer.",
        stock: 3,
        totalStock: 5,
        coverUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    }),
    prisma.book.create({
      data: {
        title: "Kalkulus dan Geometri Analitik",
        author: "Earl W. Swokowski",
        publisher: "Brooks/Cole",
        year: 2021,
        isbn: "9781133112280",
        category: "Matematika",
        description:
          "Pengantar komprehensif untuk kalkulus diferensial dan integral.",
        stock: 2,
        totalStock: 4,
        coverUrl:
          "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
      },
    }),
    prisma.book.create({
      data: {
        title: "Principles of Management",
        author: "Stephen P. Robbins",
        publisher: "Pearson",
        year: 2023,
        isbn: "9780134486833",
        category: "Bisnis",
        description:
          "Panduan lengkap tentang prinsip-prinsip manajemen modern.",
        stock: 4,
        totalStock: 6,
        coverUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    }),
    prisma.book.create({
      data: {
        title: "Fisika Dasar",
        author: "David Halliday",
        publisher: "Wiley",
        year: 2022,
        isbn: "9781118230718",
        category: "Fisika",
        description:
          "Konsep fundamental fisika untuk mahasiswa sains dan teknik.",
        stock: 1,
        totalStock: 3,
        coverUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      },
    }),
    prisma.book.create({
      data: {
        title: "Sejarah Indonesia Modern",
        author: "M.C. Ricklefs",
        publisher: "Palgrave Macmillan",
        year: 2021,
        isbn: "9781137578280",
        category: "Sejarah",
        description:
          "Kajian mendalam tentang sejarah Indonesia dari masa kolonial hingga modern.",
        stock: 5,
        totalStock: 5,
        coverUrl:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      },
    }),
    prisma.book.create({
      data: {
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        publisher: "McGraw-Hill",
        year: 2023,
        isbn: "9781260084504",
        category: "Komputer",
        description: "Konsep fundamental sistem basis data dan aplikasinya.",
        stock: 0,
        totalStock: 2,
        coverUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
      },
    }),
  ]);

  console.log(`✅ Created ${books.length} books`);

  // Create some loans
  const loans = await Promise.all([
    // Mahasiswa 1 meminjam buku
    prisma.loan.create({
      data: {
        userId: users[3].id, // Budi Santoso
        bookId: books[0].id, // Algoritma dan Struktur Data
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 hari dari sekarang
        status: "BORROWED",
      },
    }),
    // Dosen 1 request peminjaman
    prisma.loan.create({
      data: {
        userId: users[1].id, // Dr. Ahmad Setiawan
        bookId: books[2].id, // Principles of Management
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari dari sekarang
        status: "PENDING",
      },
    }),
  ]);

  console.log(`✅ Created ${loans.length} loans`);

  // Create favorites
  const favorites = await Promise.all([
    prisma.favorite.create({
      data: {
        userId: users[3].id, // Budi Santoso
        bookId: books[0].id, // Algoritma dan Struktur Data
      },
    }),
    prisma.favorite.create({
      data: {
        userId: users[4].id, // Sari Dewi
        bookId: books[1].id, // Kalkulus
      },
    }),
  ]);

  console.log(`✅ Created ${favorites.length} favorites`);

  console.log("🎉 Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
