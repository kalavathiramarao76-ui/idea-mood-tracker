"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MoodEntry = { emoji: string; label: string; value: number; note: string; date: string };

export default function TrendsPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [range, setRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    const data: MoodEntry[] = JSON.parse(localStorage.getItem('mood-entries') || '[]');
    data.sort((a, b) => a.date.localeCompare(b.date));
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(range));
    const filtered = data.filter(e => new Date(e.date) >= cutoff);
    setEntries(filtered);
  }, [range]);

  const chartData = entries.map(e => ({ date: e.date.slice(5), mood: e.value, emoji: e.emoji }));

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">&larr; Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Mood Trends</h1>

        <div className="flex gap-2 mb-6">
          {(['7','30','90'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${range === r ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {r} days
            </button>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-400">
            <p>No mood data yet. <Link href="/log" className="text-indigo-600 hover:underline">Log your first mood</Link></p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} fontSize={12} />
                <Tooltip formatter={(val: number) => {
                  const labels = ['','Bad','Low','Okay','Good','Great'];
                  return labels[val] || val;
                }} />
                <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Summary</h2>
          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Entries" value={entries.length.toString()} />
              <Stat label="Average" value={(entries.reduce((s,e) => s+e.value, 0) / entries.length).toFixed(1)} />
              <Stat label="Most Common" value={getMostCommon(entries)} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-lg text-center">
      <div className="text-2xl font-bold text-indigo-600">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function getMostCommon(entries: MoodEntry[]): string {
  const counts: Record<string, number> = {};
  entries.forEach(e => { counts[e.emoji] = (counts[e.emoji] || 0) + 1; });
  return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || '-';
}
