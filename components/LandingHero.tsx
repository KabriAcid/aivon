"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const flow = ["Dial", "AI", "Voice", "Response"];

export default function LandingHero() {
  return (
    <main className="grid-pattern min-h-screen px-6 py-10 text-white md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <p className="text-lg font-semibold tracking-wide text-aivon-accent">
            Aivon
          </p>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-aivon-muted transition hover:border-aivon-accent hover:text-white"
          >
            View Analytics
          </Link>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 shadow-glow md:p-14"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-aivon-muted">
            Telecom AI Demo
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Aivon - AI Voice of Network
          </h1>
          <p className="mt-5 max-w-2xl text-base text-aivon-muted md:text-lg">
            Dial. Speak. Get answers in your language. A real-time simulation of
            a smart telecom voice assistant built for multilingual customer
            support.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {flow.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="glass rounded-full px-4 py-2 text-sm text-white/90">
                  {step}
                </span>
                {index !== flow.length - 1 && (
                  <span className="text-aivon-muted">→</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/call"
              className="inline-flex items-center rounded-full bg-aivon-accent px-7 py-3 text-sm font-semibold text-[#04110c] transition hover:scale-[1.02]"
            >
              Start Call Simulation
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
