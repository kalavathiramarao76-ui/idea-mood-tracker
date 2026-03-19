import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, subDays, subMonths, startOfDay } from "date-fns";

type MoodEntry = {
  id: string;
  user_id: string;
  mood: number; // 1 (worst) - 5 (best)
  note?: string | null;
  created_at: string; // ISO string
};

type TimeRange = "7d" | "30d" | "90d" | "all";

const timeRangeOptions: Record<TimeRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  all: "All Time",
};

export default function TrendsPage() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [data, setData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoodData = useCallback(async (selectedRange: TimeRange) => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      let query = supabase
        .from<MoodEntry>("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (selectedRange !== "all") {
        const now = new Date();
        let startDate: Date;
        if (selectedRange === "7d") startDate = subDays(now, 7);
        else if (selectedRange === "30d") startDate = subDays(now, 30);
        else startDate = subDays(now, 90); // "90d"

        query = query.gte("created_at", startOfDay(startDate).toISOString());
      }

      const { data: entries, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setData(entries ?? []);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Failed to load mood data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoodData(range);
  }, [range, fetchMoodData]);

  const chartData = data.map((entry) => ({
    date: format(new Date(entry.created_at), "MMM d"),
    mood: entry.mood,
  }));

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Mood Trends
        </h1>

        {/* Time range selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(timeRangeOptions).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRange(key as TimeRange)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                range === key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : chartData.length === 0 ? (
          <p className="text-gray-600">No mood entries found for the selected period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => `⭐ ${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: number) => [`Mood: ${value}`, ""]} 
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}