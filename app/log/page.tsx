"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MOODS = [
  { emoji: "😀", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙁", label: "Low", value: 2 },
  { emoji: "😢", label: "Bad", value: 1 },
];

type MoodEntry = {
  emoji: string;
  label: string;
  value: number;
  note: string;
  date: string;
};

const NOTE_MAX_LENGTH = 200;

export default function LogPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const entries: MoodEntry[] = JSON.parse(
      localStorage.getItem("mood-entries") || "[]"
    );
    const existing = entries.find((e) => e.date === today);
    if (existing) {
      setTodayEntry(existing);
      const idx = MOODS.findIndex((m) => m.emoji === existing.emoji);
      if (idx >= 0) setSelected(idx);
      setNote(existing.note || "");
    }
  }, [today]);

  const handleSave = () => {
    if (selected === null) return;
    const mood = MOODS[selected];
    const entry: MoodEntry = {
      emoji: mood.emoji,
      label: mood.label,
      value: mood.value,
      note,
      date: today,
    };
    const entries: MoodEntry[] = JSON.parse(
      localStorage.getItem("mood-entries") || "[]"
    );
    const filtered = entries.filter((e) => e.date !== today);
    filtered.push(entry);
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem("mood-entries", JSON.stringify(filtered));
    setSaved(true);
    setTodayEntry(entry);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selected === null) return;
    let newIndex = selected;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      newIndex = (selected + 1) % MOODS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      newIndex = (selected - 1 + MOODS.length) % MOODS.length;
    } else {
      return;
    }
    e.preventDefault();
    setSelected(newIndex);
    buttonRefs.current[newIndex]?.focus();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">
          &larr; Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Log Your Mood</h1>
        <p className="text-gray-500 mb-4">How are you feeling today? ({today})</p>

        <fieldset className="mb-6">
          <legend className="sr-only">Select your mood</legend>
          <div
            role="radiogroup"
            aria-label="Mood selection"
            className="flex gap-3 justify-center"
            onKeyDown={handleKeyDown}
          >
            {MOODS.map((mood, i) => (
              <button
                key={mood.emoji}
                type="button"
                ref={(el) => (buttonRefs.current[i] = el)}
                role="radio"
                aria-checked={selected === i}
                tabIndex={selected === i ? 0 : -1}
                onClick={() => setSelected(i)}
                aria-label={mood.label}
                className={`text-4xl p-3 rounded-xl transition ${
                  selected === i
                    ? "bg-indigo-100 ring-2 ring-indigo-500 scale-110"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {mood.emoji}
                <div className="text-xs text-gray-500 mt-1">{mood.label}</div>
              </button>
            ))}
          </div>
        </fieldset>

        <label htmlFor="note" className="block mb-2 font-medium text-gray-700">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          maxLength={NOTE_MAX_LENGTH}
          aria-describedby="note-help note-count"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-1"
          rows={3}
        />
        <p id="note-help" className="text-sm text-gray-500 mb-1">
          Optional note (max {NOTE_MAX_LENGTH} characters)
        </p>
        <p
          id="note-count"
          className="text-sm text-gray-500 text-right mb-4"
          aria-live="polite"
        >
          {note.length}/{NOTE_MAX_LENGTH}
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={selected === null}
          aria-disabled={selected === null}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {todayEntry ? "Update Mood" : "Save Mood"}
        </button>

        {saved && (
          <p
            role="status"
            aria-live="polite"
            className="text-green-600 text-center mt-3 font-medium"
          >
            Mood saved!
          </p>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Recent Entries</h2>
          <RecentEntries />
        </div>
      </div>
    </main>
  );
}

function RecentEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  useEffect(() => {
    const data: MoodEntry[] = JSON.parse(
      localStorage.getItem("mood-entries") || "[]"
    );
    setEntries(data.slice(0, 7));
  }, []);

  if (entries.length === 0)
    return <p className="text-gray-400 text-sm">No entries yet.</p>;

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div
          key={e.date}
          className="flex items-center gap-3 bg-white p-3 rounded-lg"
        >
          <span className="text-2xl">{e.emoji}</span>
          <div>
            <div className="text-sm font-medium">{e.date}</div>
            {e.note && <div className="text-xs text-gray-500">{e.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}