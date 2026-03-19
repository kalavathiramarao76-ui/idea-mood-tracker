"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type MoodLog = {
  id: string;
  user_id: string;
  mood: string;
  notes: string | null;
  created_at: string;
};

const EMOJIS = ["😀", "🙂", "😐", "🙁", "😢", "🤢", "😡"];

export default function MoodLogPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmoji) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: insertError } = await supabase
        .from<MoodLog>("mood_logs")
        .insert({
          user_id: userId,
          mood: selectedEmoji,
          notes: notes.trim() ? notes.trim() : null,
        });

      if (insertError) throw insertError;

      setSuccess("Mood logged successfully!");
      setSelectedEmoji("");
      setNotes("");
      // Optionally redirect to dashboard after a short delay
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message ?? "Failed to log mood.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Log Your Mood
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose an emoji
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-lg border
                    ${selectedEmoji === emoji ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                    text-2xl transition-colors hover:border-blue-400
                  `}
                  aria-pressed={selectedEmoji === emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Optional notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="How are you feeling today?"
            />
          </div>

          {/* Feedback messages */}
          {error && (
            <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>
          )}
          {success && (
            <p className="rounded bg-green-100 p-2 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedEmoji || loading}
              className={`
                inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium
                text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:hover:bg-blue-600
              `}
            >
              {loading ? (
                <svg
                  className="mr-2 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {loading ? "Saving…" : "Save Mood"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}