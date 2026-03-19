"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MoodEntry = { emoji: string; label: string; value: number; note: string; date: string };

export default function DashboardPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data: MoodEntry[] = JSON.parse(localStorage.getItem('mood-entries') || '[]');
    data.sort((a, b) => b.date.localeCompare(a.date));
    setEntries(data);

    // Calculate streak
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (data.some(e => e.date === dateStr)) s++;
      else break;
    }
    setStreak(s);
  }, []);

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);
  const avg = entries.length > 0 ? (entries.reduce((s, e) => s + e.value, 0) / entries.length).toFixed(1) : '—';

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">&larr; Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Today" value={todayEntry ? todayEntry.emoji : '—'} />
          <StatCard label="Streak" value={streak + 'd'} />
          <StatCard label="Total" value={entries.length.toString()} />
          <StatCard label="Average" value={avg} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard href="/log" icon="📝" title="Log Mood" desc="Record how you feel today" />
          <ActionCard href="/trends" icon="📊" title="Trends" desc="View your mood charts" />
          <ActionCard href="/tips" icon="💡" title="Tips" desc="Get wellness suggestions" />
          <ActionCard href="/settings" icon="⚙️" title="Settings" desc="Export or manage data" />
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl text-center shadow-sm">
      <div className="text-2xl font-bold text-indigo-600">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link href={href} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition block">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{desc}</div>
    </Link>
  );
}
