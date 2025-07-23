"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  id: string;
  maxLoanDays: number;
  maxRenewalCount: number;
  maxLoanPerUser: number;
  finePerDay: number;
  reminderDaysBefore: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat pengaturan");
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: Number(value) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil disimpan.",
      });
    } catch {
      toast({
        title: "Gagal",
        description: "Gagal menyimpan pengaturan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Pengaturan Sistem
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : settings ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-900">
              Batas Maksimal Peminjaman (hari)
            </label>
            <input
              type="number"
              name="maxLoanDays"
              value={settings.maxLoanDays}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-800"
              min={1}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-900">
              Batas Maksimal Perpanjangan
            </label>
            <input
              type="number"
              name="maxRenewalCount"
              value={settings.maxRenewalCount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-800"
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-900">
              Batas Maksimal Peminjaman per User
            </label>
            <input
              type="number"
              name="maxLoanPerUser"
              value={settings.maxLoanPerUser}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-800"
              min={1}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-900">
              Denda per Hari (Rp)
            </label>
            <input
              type="number"
              name="finePerDay"
              value={settings.finePerDay}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-800"
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-900">
              Reminder Sebelum Jatuh Tempo (hari)
            </label>
            <input
              type="number"
              name="reminderDaysBefore"
              value={settings.reminderDaysBefore}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded text-gray-800"
              min={0}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
