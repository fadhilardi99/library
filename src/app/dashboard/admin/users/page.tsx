"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MAHASISWA" | "DOSEN";
  isActive: boolean;
}

const roles = ["ADMIN", "MAHASISWA", "DOSEN"];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data user");
        setLoading(false);
      });
  }, []);

  // Helper untuk fetch ulang data user
  const refetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data user");
        setLoading(false);
      });
  };

  const handleRoleChange = (id: string, newRole: string) => {
    fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    }).then(() => refetchUsers());
  };

  const handleStatusChange = (id: string, newStatus: boolean) => {
    fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: newStatus }),
    }).then(() => refetchUsers());
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole ? user.role === filterRole : true;
    const matchStatus = filterStatus
      ? filterStatus === "AKTIF"
        ? user.isActive
        : !user.isActive
      : true;
    return matchSearch && matchRole && matchStatus;
  });

  const handleDelete = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refetchUsers();
    setShowDelete(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen User</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">Semua Role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="NONAKTIF">Nonaktif</option>
        </select>
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
                  Nama
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Role
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 border-b text-gray-900 font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-gray-800"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    <button
                      onClick={() =>
                        handleStatusChange(user.id, !user.isActive)
                      }
                      className={
                        user.isActive
                          ? "bg-green-500 text-white px-3 py-1 rounded"
                          : "bg-gray-400 text-white px-3 py-1 rounded"
                      }
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    <button
                      onClick={() => setShowDelete(user.id)}
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
      {/* Modal Konfirmasi Hapus */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-800">Yakin ingin menghapus user ini?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDelete)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
