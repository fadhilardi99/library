"use client";

import { useEffect, useState } from "react";
import { Users, Trash2, UserCog, ShieldCheck } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">Manajemen User</h1>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-xl w-full sm:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-800"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-xl w-full sm:w-1/4 shadow-sm text-gray-800"
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
          className="border border-gray-200 px-4 py-2 rounded-xl w-full sm:w-1/4 shadow-sm text-gray-800"
        >
          <option value="">Semua Status</option>
          <option value="AKTIF">Aktif</option>
          <option value="NONAKTIF">Nonaktif</option>
        </select>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-2xl">
                Nama
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tr-2xl">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr
                key={user.id}
                className={
                  i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50 hover:bg-blue-50 transition"
                }
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-gray-700">{user.email}</td>
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={16}
                      className={
                        user.role === "ADMIN"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border rounded-lg px-2 py-1 text-gray-800 bg-white shadow-sm"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <button
                    onClick={() => handleStatusChange(user.id, !user.isActive)}
                    className={
                      user.isActive
                        ? "flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 shadow"
                        : "flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded-lg hover:bg-gray-500 shadow"
                    }
                  >
                    <UserCog size={16} /> {user.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    onClick={() => setShowDelete(user.id)}
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
      {/* Modal Konfirmasi Hapus */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[320px] max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
              <Trash2 size={22} /> Konfirmasi Hapus
            </h2>
            <p className="text-gray-800 mb-4">
              Yakin ingin menghapus user ini?
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
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold"
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
