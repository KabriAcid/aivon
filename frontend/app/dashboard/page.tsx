"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const languageStats = [
  { name: "Hausa", calls: 42 },
  { name: "English", calls: 31 },
  { name: "Yoruba", calls: 18 },
  { name: "Igbo", calls: 14 },
];

const recentQueries = [
  "Need fertilizer timing advice for rice farm.",
  "How do I fix weak voice signal in my district?",
  "I want to hear weather forecast in Hausa.",
  "How can I reduce call drops during peak hours?",
];

export default function DashboardPage() {
  return (
    <main className="grid-pattern min-h-screen p-4 text-white md:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Aivon Analytics Dashboard
          </h1>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-aivon-muted"
          >
            Back Home
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Total Calls Today
            </p>
            <p className="mt-3 text-4xl font-semibold">105</p>
          </div>
          <div className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Average Call Duration
            </p>
            <p className="mt-3 text-4xl font-semibold">03:41</p>
          </div>
          <div className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              AI Response Time
            </p>
            <p className="mt-3 text-4xl font-semibold">0.92s</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Language Distribution
            </p>
            <div className="mt-4 h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageStats}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis dataKey="name" stroke="#9EAFCC" />
                  <YAxis stroke="#9EAFCC" />
                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Bar dataKey="calls" fill="#4EE0A2" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-aivon-muted">
              Recent Queries
            </p>
            <ul className="mt-4 space-y-2">
              {recentQueries.map((query) => (
                <li
                  key={query}
                  className="rounded-xl border border-white/10 px-3 py-3 text-sm text-white/90"
                >
                  {query}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
