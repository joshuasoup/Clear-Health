"use client";
import Link from "next/link";
import "../styles/globals.css";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--cloud)] text-[var(--ink)] px-6">
      <div className="radiant-blob -left-10 -top-10" />
      <div className="radiant-blob right-0 bottom-0" />
      <div className="glass-card p-10 md:p-12 bg-white/90 rounded-none shadow-lg relative z-10 text-center max-w-xl w-full">
        <p className="section-kicker">Page missing</p>
        <h1 className="headline text-4xl md:text-5xl mt-3 mb-4">404 – Not Found</h1>
        <p className="text-[var(--muted-ink)] mb-8">
          The page you’re looking for doesn’t exist. Return to the home page to keep exploring Clear Health.
        </p>
        <Link href="/" className="special-button px-6 py-3 text-base">
          Back to home
        </Link>
      </div>
    </div>
  );
}
