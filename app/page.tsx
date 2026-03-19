import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Mood Tracker – Home",
  description:
    "Log your daily mood, visualize trends, and receive AI‑powered wellness tips.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 bg-gradient-to-b from-indigo-100 to-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Mood Tracker
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Capture how you feel each day with emojis, see your mood trends,
            and get personalized wellness tips powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="mt-12 w-full max-w-md">
          <Image
            src="/hero-emoji.png"
            alt="Mood emojis"
            width={500}
            height={300}
            className="mx-auto"
          />
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            href="/log"
            title="Log Mood"
            description="Select an emoji and add a note for today’s mood."
            icon="📝"
          />
          <FeatureCard
            href="/trends"
            title="Mood Trends"
            description="Visualize your mood over weeks, months, or years."
            icon="📈"
          />
          <FeatureCard
            href="/tips"
            title="Wellness Tips"
            description="AI‑generated suggestions tailored to your mood patterns."
            icon="💡"
          />
          <FeatureCard
            href="/settings"
            title="Settings"
            description="Manage your account, data export, and preferences."
            icon="⚙️"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Mood Tracker. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

type FeatureCardProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

function FeatureCard({ href, title, description, icon }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition bg-white"
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
          {title}
        </h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}