"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MoodEntry = { emoji: string; label: string; value: number; note: string; date: string };

const TIPS_DB: Record<string, string[]> = {
  low: [
    'Take a 10-minute walk outside — nature and movement boost mood significantly.',
    'Try the 5-4-3-2-1 grounding exercise: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.',
    'Reach out to someone you trust — connection is a powerful mood lifter.',
    'Write down 3 things you are grateful for, no matter how small.',
    'Give yourself permission to rest. Its okay to have a slow day.',
  ],
  neutral: [
    'Try something new today — even a small change in routine can spark positive feelings.',
    'Set one small, achievable goal for today and celebrate when you finish it.',
    'Spend 5 minutes stretching or doing deep breathing.',
    'Listen to a playlist that makes you feel energized.',
    'Drink a glass of water and eat something nourishing.',
  ],
  high: [
    'Channel this positive energy into a creative project or hobby!',
    'Share your good mood with someone — compliment a friend or colleague.',
    'Journal about what made today great so you can revisit it later.',
    'Use this momentum to tackle something youve been putting off.',
    'Practice mindfulness to fully savor this feeling.',
  ],
};

export default function TipsPage() {
  const [tips, setTips] = useState<string[]>([]);
  const [moodCategory, setMoodCategory] = useState('');
  const [avgMood, setAvgMood] = useState(0);

  useEffect(() => {
    const entries: MoodEntry[] = JSON.parse(localStorage.getItem('mood-entries') || '[]');
    const recent = entries.slice(0, 7);
    if (recent.length === 0) {
      setTips(['Start logging your moods to get personalized wellness tips!']);
      return;
    }
    const avg = recent.reduce((s, e) => s + e.value, 0) / recent.length;
    setAvgMood(avg);
    let category: string;
    if (avg <= 2.5) { category = 'low'; setMoodCategory('could use a boost'); }
    else if (avg <= 3.5) { category = 'neutral'; setMoodCategory('steady'); }
    else { category = 'high'; setMoodCategory('great'); }

    const pool = TIPS_DB[category];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setTips(shuffled.slice(0, 3));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">&larr; Home</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Wellness Tips</h1>
        {moodCategory && (
          <p className="text-gray-500 mb-6">
            Your recent mood average is <span className="font-semibold text-indigo-600">{avgMood.toFixed(1)}/5</span> ({moodCategory}).
          </p>
        )}

        <div className="space-y-4">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium">
            Refresh Tips
          </button>
        </div>
      </div>
    </main>
  );
}
