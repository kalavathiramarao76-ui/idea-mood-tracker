"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type MoodEntry = {
  emoji: string;
  label: string;
  value: number;
  note: string;
  date: string;
};

export default function SettingsPage() {
  const [entryCount, setEntryCount] = useState(0);
  const [exportDone, setExportDone] = useState(false);
  const [clearDone, setClearDone] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load entry count on mount
  useEffect(() => {
    const entries: MoodEntry[] = JSON.parse(
      localStorage.getItem("mood-entries") || "[]"
    );
    setEntryCount(entries.length);
  }, []);

  // Focus trap & Escape handling for modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showClearModal) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setShowClearModal(false);
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = [
          cancelBtnRef.current,
          confirmBtnRef.current,
        ].filter(Boolean) as HTMLElement[];

        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    },
    [showClearModal]
  );

  useEffect(() => {
    if (showClearModal) {
      // Focus the cancel button when modal opens
      cancelBtnRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showClearModal, handleKeyDown]);

  const exportCSV = () => {
    try {
      const entries: MoodEntry[] = JSON.parse(
        localStorage.getItem("mood-entries") || "[]"
      );

      const csvHeader = "Date,Emoji,Label,Value,Note";
      const csvRows = entries.map((e) => {
        const safeNote = (e.note || "").replace(/"/g, '""');
        return `${e.date},${e.emoji},${e.label},${e.value},"${safeNote}"`;
      });
      const csvContent = [csvHeader, ...csvRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "mood-tracker-export.csv";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Clean up after a short delay to ensure the download has started
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Failed to export CSV:", error);
    } finally {
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2000);
    }
  };

  const handleClearConfirm = () => {
    localStorage.removeItem("mood-entries");
    setEntryCount(0);
    setClearDone(true);
    setTimeout(() => setClearDone(false), 2000);
    setShowClearModal(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-indigo-600 hover:underline text-sm">
          &larr; Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Settings</h1>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-1">Your Data</h2>
            <p className="text-gray-500 text-sm">
              {entryCount} mood entries stored locally in your browser.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Export Data</h2>
            <p className="text-gray-500 text-sm mb-3">
              Download all your mood entries as a CSV file.
            </p>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              Export CSV
            </button>
            {exportDone && (
              <span className="ml-2 text-green-600 text-sm">Downloaded!</span>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100">
            <h2 className="font-semibold text-lg mb-2 text-red-600">
              Danger Zone
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              Permanently delete all your mood data.
            </p>
            <button
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              Clear All Data
            </button>
            {clearDone && (
              <span className="ml-2 text-red-600 text-sm">Data cleared.</span>
            )}
          </div>
        </div>
      </div>

      {showClearModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          aria-describedby="clear-modal-desc"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
          >
            <h3
              id="clear-modal-title"
              className="text-lg font-medium text-gray-900 mb-4"
            >
              Confirm Deletion
            </h3>
            <p id="clear-modal-desc" className="text-gray-600 mb-6">
              Are you sure you want to permanently delete all your mood entries?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                ref={cancelBtnRef}
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                ref={confirmBtnRef}
                onClick={handleClearConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}