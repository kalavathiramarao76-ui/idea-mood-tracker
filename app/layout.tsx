import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mood Tracker',
  description: 'Log your daily mood with emojis, see trends over time, and get wellness tips.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
