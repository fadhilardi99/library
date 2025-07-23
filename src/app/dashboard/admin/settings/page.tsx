"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  CalendarCheck2,
  Repeat2,
  Users2,
  BadgeDollarSign,
  Bell,
} from "lucide-react";

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
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">Pengaturan Sistem</h1>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="bg-white rounded-2xl shadow p-8">
        {loading ? (
          <div>Loading...</div>
        ) : settings ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block mb-1 text-gray-900 flex items-center gap-2">
                <CalendarCheck2 size={18} className="text-blue-500" />
                Batas Maksimal Peminjaman (hari)
              </label>
              <input
                type="number"
                name="maxLoanDays"
                value={settings.maxLoanDays}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-gray-800 shadow-sm"
                min={1}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-900 flex items-center gap-2">
                <Repeat2 size={18} className="text-blue-500" />
                Batas Maksimal Perpanjangan
              </label>
              <input
                type="number"
                name="maxRenewalCount"
                value={settings.maxRenewalCount}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-gray-800 shadow-sm"
                min={0}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-900 flex items-center gap-2">
                <Users2 size={18} className="text-blue-500" />
                Batas Maksimal Peminjaman per User
              </label>
              <input
                type="number"
                name="maxLoanPerUser"
                value={settings.maxLoanPerUser}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-gray-800 shadow-sm"
                min={1}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-900 flex items-center gap-2">
                <BadgeDollarSign size={18} className="text-blue-500" />
                Denda per Hari (Rp)
              </label>
              <input
                type="number"
                name="finePerDay"
                value={settings.finePerDay}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-gray-800 shadow-sm"
                min={0}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-blue-500" />
                Reminder Sebelum Jatuh Tempo (hari)
              </label>
              <input
                type="number"
                name="reminderDaysBefore"
                value={settings.reminderDaysBefore}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-gray-800 shadow-sm"
                min={0}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-semibold"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
