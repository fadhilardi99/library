"use client";

export default function AdminDashboard() {
  // Dummy data statistik
  const stats = [
    { label: "Total Buku", value: 1200 },
    { label: "Total Peminjaman", value: 340 },
    { label: "Pengguna Aktif", value: 87 },
    { label: "Buku Favorit", value: "Algoritma dan Struktur Data" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center"
          >
            <span className="text-gray-500 text-sm mb-2">{item.label}</span>
            <span className="text-2xl font-bold text-blue-700">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      {/* Konten admin lainnya bisa ditambahkan di sini */}
    </div>
  );
}
