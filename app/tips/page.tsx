import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

type MoodEntry = {
  mood: string;
  created_at: string;
};

type TipsResponse = {
  tips: string;
  error?: string;
};

async function fetchUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return user;
}

async function fetchRecentMoods(userId: string, limit = 30): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('moods')
    .select('mood, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching moods:', error);
    return [];
  }

  return data as MoodEntry[];
}

async function generateTips(moods: MoodEntry[]): Promise<TipsResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return { tips: '', error: 'OpenAI API key not configured.' };
  }

  const prompt = `
You are a wellness coach. Based on the following mood entries (most recent first), provide three concise, actionable wellness tips tailored to the user's recent emotional pattern. Keep the tone supportive and friendly.

Mood entries:
${moods
    .map(
      (m) =>
        `- ${new Date(m.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}: ${m.mood}`
    )
    .join('\n')}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI error:', err);
      return { tips: '', error: 'Failed to generate tips.' };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() ?? '';
    return { tips: content };
  } catch (e) {
    console.error('OpenAI request failed:', e);
    return { tips: '', error: 'Unexpected error while generating tips.' };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TipsPage() {
  const [tips, setTips] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTips() {
      setLoading(true);
      setError(null);
      try {
        const user = await fetchUser();
        const moods = await fetchRecentMoods(user.id);
        const { tips, error: genError } = await generateTips(moods);
        if (genError) {
          setError(genError);
        } else {
          setTips(tips);
        }
      } catch (e) {
        console.error(e);
        setError('Unable to load tips.');
      } finally {
        setLoading(false);
      }
    }

    loadTips();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await fetchUser();
      const moods = await fetchRecentMoods(user.id);
      const { tips, error: genError } = await generateTips(moods);
      if (genError) {
        setError(genError);
      } else {
        setTips(tips);
      }
    } catch (e) {
      console.error(e);
      setError('Unable to refresh tips.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Personalized Wellness Tips</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary-600"
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
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <p className="text-lg leading-relaxed whitespace-pre-line">{tips}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 w-full md:w-auto inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Refresh Tips
          </button>
        </div>
      )}
    </section>
  );
}