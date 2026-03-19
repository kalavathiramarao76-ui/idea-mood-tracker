import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Mood Tracker</h1>
        <p className="text-xl text-gray-600 mb-8">
          Log how you feel each day, visualize your mood trends, and discover wellness tips.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/log" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            Log Your Mood
          </Link>
          <Link href="/trends" className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-50 transition">
            View Trends
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-lg mb-1">Daily Logging</h3>
            <p className="text-gray-500 text-sm">Pick an emoji that matches your mood and add optional notes.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-lg mb-1">Trend Charts</h3>
            <p className="text-gray-500 text-sm">See your mood patterns over days, weeks, and months.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold text-lg mb-1">Wellness Tips</h3>
            <p className="text-gray-500 text-sm">Get personalized suggestions based on your mood history.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
