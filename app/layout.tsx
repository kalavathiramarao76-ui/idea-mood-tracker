import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mood Tracker',
    template: `%s | Mood Tracker`,
  },
  description:
    'A web app for logging daily moods with emojis, visualizing trends, and receiving AI‑powered wellness tips.',
  icons: {
    icon: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head />
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}