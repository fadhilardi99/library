import { prisma } from "./lib/db";
import { UserRole, Category } from "@prisma/client";

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        clerkId: "admin-1",
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        clerkId: "mahasiswa-1",
        email: "mahasiswa@example.com",
        firstName: "Budi",
        lastName: "Santoso",
        role: UserRole.MAHASISWA,
        isActive: true,
        studentId: "S1234567",
        nim: "20230001",
        department: "Teknik Informatika",
      },
      {
        clerkId: "dosen-1",
        email: "dosen@example.com",
        firstName: "Dewi",
        lastName: "Sari",
        role: UserRole.DOSEN,
        isActive: true,
        department: "Matematika",
      },
    ],
    skipDuplicates: true,
  });

  // Seed Books
  await prisma.book.createMany({
    data: [
      {
        title: "Belajar Pemrograman",
        author: "Andi Wijaya",
        publisher: "Informatika Press",
        publishedYear: 2022,
        category: Category.TEKNOLOGI,
        totalCopies: 5,
        availableCopies: 5,
        language: "id",
      },
      {
        title: "Dasar-Dasar Ekonomi",
        author: "Siti Aminah",
        publisher: "Ekonomi Jaya",
        publishedYear: 2021,
        category: Category.EKONOMI,
        totalCopies: 3,
        availableCopies: 3,
        language: "id",
      },
      {
        title: "Sejarah Dunia",
        author: "Bambang Prakoso",
        publisher: "Sejarah Nusantara",
        publishedYear: 2020,
        category: Category.SEJARAH,
        totalCopies: 2,
        availableCopies: 2,
        language: "id",
      },
    ],
    skipDuplicates: true,
  });

  // Seed SystemSettings (only one row)
  await prisma.systemSettings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      maxLoanDays: 14,
      maxRenewalCount: 2,
      maxLoanPerUser: 5,
      finePerDay: 1000,
      reminderDaysBefore: 3,
    },
  });
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
