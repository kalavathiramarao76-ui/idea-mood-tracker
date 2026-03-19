import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

"use client";

interface MoodEntry {
  id: string;
  mood: string;
  note: string | null;
  created_at: string;
}

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
    id: string;
    email: string | null;
    user_metadata: { full_name?: string };
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
        return;
      }
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name ?? "");
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (error) {
      setError(error.message);
    } else {
      // Refresh user data
      const {
        data: { user: updatedUser },
        error: fetchErr,
      } = await supabase.auth.getUser();
      if (!fetchErr && updatedUser) setUser(updatedUser);
    }
    setLoading(false);
  };

  const handleExportCSV = async () => {
    if (!user) return;
    setExporting(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from<MoodEntry>("moods")
        .select("id,mood,note,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const csvRows = [
        ["ID", "Mood", "Note", "Created At"].join(","),
        ...data.map((row) =>
          [
            `"${row.id}"`,
            `"${row.mood}"`,
            `"${row.note?.replace(/"/g, '""') ?? ""}"`,
            `"${row.created_at}"`,
          ].join(",")
        ),
      ];
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mood_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message ?? "Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <section className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Profile
        </h2>
        {user ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Your name"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        ) : (
          <p className="text-gray-500">Loading profile…</p>
        )}
      </div>

      {/* Export Data Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Export Mood Data
        </h2>
        <p className="mb-4 text-gray-600">
          Download all of your mood entries as a CSV file for personal analysis.
        </p>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {exporting ? "Preparing…" : "Export as CSV"}
        </button>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
        <p className="text-gray-700">Signed in as {user?.email}</p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
}