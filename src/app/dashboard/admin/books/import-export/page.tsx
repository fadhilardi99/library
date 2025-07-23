"use client";

import { useRef, useState } from "react";
import { parse as parseCSV } from "csv-parse/sync";
import { read, utils } from "xlsx";
import {
  Import,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Eye,
} from "lucide-react";

const exportFormats = [
  {
    label: "CSV",
    value: "csv",
    icon: <FileText size={16} className="inline mr-1" />,
  },
  {
    label: "Excel",
    value: "xlsx",
    icon: <FileSpreadsheet size={16} className="inline mr-1" />,
  },
  {
    label: "JSON",
    value: "json",
    icon: <FileJson size={16} className="inline mr-1" />,
  },
];

export default function ImportExportBooksPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<Array<
    Record<string, unknown>
  > | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/books/export?format=${exportFormat}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `books.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewData(null);
    setPreviewError(null);
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let data: Array<Record<string, unknown>> = [];
      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        data = parseCSV(text, { columns: true });
      } else if (file.name.endsWith(".json")) {
        const text = await file.text();
        data = JSON.parse(text);
      } else if (file.name.endsWith(".xlsx")) {
        const ab = await file.arrayBuffer();
        const wb = read(new Uint8Array(ab), { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        data = utils.sheet_to_json(ws);
      } else {
        setPreviewError("Format file tidak didukung");
        return;
      }
      if (!Array.isArray(data) || data.length === 0) {
        setPreviewError("File tidak berisi data buku");
        return;
      }
      setPreviewData(data.slice(0, 10));
    } catch {
      setPreviewError("Gagal membaca file");
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;
    setImporting(true);
    setImportResult(null);
    const file = fileInputRef.current.files[0];
    let contentType = "";
    if (file.name.endsWith(".csv")) contentType = "text/csv";
    else if (file.name.endsWith(".json")) contentType = "application/json";
    else if (file.name.endsWith(".xlsx"))
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    else contentType = file.type;
    try {
      const res = await fetch("/api/books/import", {
        method: "POST",
        headers: { "content-type": contentType },
        body: await file.arrayBuffer(),
      });
      const data = await res.json();
      if (data.success)
        setImportResult(`Berhasil import ${data.imported} buku.`);
      else setImportResult(data.error || "Gagal import buku.");
    } catch {
      setImportResult("Gagal import buku.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewData(null);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Download size={32} className="text-blue-600" />
        <h1 className="text-2xl font-bold text-blue-900">
          Import / Export Buku
        </h1>
      </div>
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <label className="block mb-2 text-gray-900 font-semibold flex items-center gap-2">
          <Upload size={18} className="text-blue-500" /> Export Buku
        </label>
        <div className="flex gap-2 items-center">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-gray-800"
          >
            {exportFormats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-semibold"
            disabled={exporting}
          >
            {exporting ? (
              "Mengekspor..."
            ) : (
              <span className="flex items-center gap-1">
                <Upload size={16} /> Export
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <label className="block mb-2 text-gray-900 font-semibold flex items-center gap-2">
          <Download size={18} className="text-green-500" /> Import Buku
        </label>
        <form
          onSubmit={handleImport}
          className="flex flex-col gap-2 items-start"
        >
          <input
            type="file"
            accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.json"
            ref={fileInputRef}
            className="border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-gray-800"
            required
            onChange={handleFileChange}
          />
          {previewError && (
            <div className="text-red-600 text-sm">{previewError}</div>
          )}
          {previewData && (
            <div className="w-full overflow-x-auto border rounded-2xl bg-gray-50 mb-2 mt-2 shadow">
              <div className="flex items-center gap-2 p-2 text-blue-700 font-semibold text-sm">
                <Eye size={16} /> Preview: {previewData.length} baris pertama
              </div>
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-2 py-1 border-b text-gray-900 font-semibold"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      {Object.keys(previewData[0]).map((key) => (
                        <td
                          key={key}
                          className="px-2 py-1 border-b text-gray-800"
                        >
                          {String(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 font-semibold"
            disabled={importing || !previewData}
          >
            {importing ? (
              "Mengimpor..."
            ) : (
              <span className="flex items-center gap-1">
                <Download size={16} /> Import
              </span>
            )}
          </button>
        </form>
        {importResult && (
          <div className="mt-2 text-sm text-gray-700">{importResult}</div>
        )}
      </div>
    </div>
  );
}
