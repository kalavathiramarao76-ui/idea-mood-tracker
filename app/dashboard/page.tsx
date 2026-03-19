import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { FaSmile, FaChartLine, FaLightbulb } from "react-icons/fa";

type Props = {};

export default async function DashboardPage({}: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome back, {session.user.email?.split("@")[0] ?? "User"}!
      </h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={session.user.id} />
      </Suspense>
    </main>
  );
}

async function DashboardContent({ userId }: { userId: string }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: moods, error } = await supabase
    .from("moods")
    .select("mood, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(7);

  if (error) {
    console.error("Failed to fetch moods:", error);
    // In production you might want to show a toast or a dedicated error UI
    return (
      <div className="text-red-600">
        Unable to load your mood data. Please try again later.
      </div>
    );
  }

  const recentMoods = moods ?? [];

  const moodStreak = calculateStreak(recentMoods);
  const todayMood = recentMoods.find((m) => {
    const today = new Date();
    const created = new Date(m.created_at);
    return (
      today.toDateString() === created.toDateString()
    );
  });

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Your Summary
        </h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-semibold">Current Streak:</span>{" "}
            {moodStreak} day{moodStreak !== 1 ? "s" : ""}
          </p>
          <p>
            <span className="font-semibold">Today&apos;s Mood:</span>{" "}
            {todayMood ? moodEmoji(todayMood.mood) : "Not logged yet"}
          </p>
          <p>
            <span className="font-semibold">Last 7 entries:</span>{" "}
            {recentMoods.length}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <Link
        href="/log"
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow p-6 flex flex-col items-center justify-center transition-colors"
      >
        <FaSmile className="text-4xl mb-3" />
        <span className="text-lg font-medium">Log Mood</span>
      </Link>

      <Link
        href="/trends"
        className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow p-6 flex flex-col items-center justify-center transition-colors"
      >
        <FaChartLine className="text-4xl mb-3" />
        <span className="text-lg font-medium">View Trends</span>
      </Link>

      <Link
        href="/tips"
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow p-6 flex flex-col items-center justify-center transition-colors"
      >
        <FaLightbulb className="text-4xl mb-3" />
        <span className="text-lg font-medium">Get Tips</span>
      </Link>
    </section>
  );
}

function calculateStreak(moods: { created_at: string }[]): number {
  if (!moods.length) return 0;

  const dates = moods.map((m) => new Date(m.created_at).toDateString());
  let streak = 0;
  let current = new Date();

  for (let i = 0; i < dates.length; i++) {
    if (dates[i] === current.toDateString()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      // break when a day is missing
      if (new Date(dates[i]).getTime() < current.getTime()) break;
    }
  }
  return streak;
}

function moodEmoji(mood: string): string {
  const map: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    excited: "🤩",
    anxious: "😟",
  };
  return map[mood] ?? mood;
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-40 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}