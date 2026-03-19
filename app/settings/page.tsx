"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MoodEntry = { emoji: string; label: string; value: number; note: string; date: string };

export default function SettingsPage() {
  const [entryCount, setEntryCount] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const [clearDone, setClearDone] = useState(false);

  useEffect(() => {
    const entries: MoodEntry[] = JSON.parse(localStorage.getItem('mood-entries') || '[]');
    setEntryCount(entries.length);
  }, []);

  const exportCSV = () => {
    const entries: MoodEntry[] = JSON.parse(localStorage.getItem('mood-entries') || '[]');
    const csv = 'Date,Emoji,Label,Value,Note\n' + entries.map(e =>
      `${e.date},${e.emoji},${e.label},${e.value},"${(e.note||'').replace(/"/g,'""')}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mood-tracker-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const clearData = () => {
    if (confirm('Are you sure? This will delete all your mood entries.')) {
      localStorage.removeItem('mood-entries');
      setEntryCount(0);
      setClearDone(true);
      setTimeout(() => setClearDone(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">&larr; Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Settings</h1>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-1">Your Data</h2>
            <p className="text-gray-500 text-sm">{entryCount} mood entries stored locally in your browser.</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Export Data</h2>
            <p className="text-gray-500 text-sm mb-3">Download all your mood entries as a CSV file.</p>
            <button onClick={exportCSV}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
              Export CSV
            </button>
            {exportDone && <span className="ml-2 text-green-600 text-sm">Downloaded!</span>}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100">
            <h2 className="font-semibold text-lg mb-2 text-red-600">Danger Zone</h2>
            <p className="text-gray-500 text-sm mb-3">Permanently delete all your mood data.</p>
            <button onClick={clearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
              Clear All Data
            </button>
            {clearDone && <span className="ml-2 text-red-600 text-sm">Data cleared.</span>}
          </div>
        </div>
      </div>
    </main>
  );
}
