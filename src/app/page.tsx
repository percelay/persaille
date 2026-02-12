"use client";

import { useState } from "react";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 md:px-16">
        <span className="text-xl font-bold tracking-tight">persaille</span>
        <button
          onClick={() => setContactOpen(true)}
          className="text-base text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Get in touch
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none">
          Easy.
          <br />
          Simple.
          <br />
          Reliable.
        </h1>

        <div className="mt-12 max-w-md">
          <p className="text-xl text-neutral-400 leading-relaxed">
            Websites, marketing, and SEO — built right.
          </p>
        </div>

        <div className="mt-16 flex items-center gap-4">
          <div className="h-px w-12 bg-neutral-700" />
          <p className="text-sm text-neutral-500">
            Founded by Dale Percelay, Computer Science @ Cal Poly
          </p>
          <div className="h-px w-12 bg-neutral-700" />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 md:px-16 text-center">
        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Persaille
        </p>
      </footer>

      {/* Contact Modal */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-10 py-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-6">Get in touch</h2>
            <p className="text-neutral-300">
              <a href="tel:2012137155" className="hover:text-white transition-colors">
                (201) 213-7155
              </a>
            </p>
            <p className="text-neutral-300 mt-2">
              <a href="mailto:dale@persaille.com" className="hover:text-white transition-colors">
                dale@persaille.com
              </a>
            </p>
            <button
              onClick={() => setContactOpen(false)}
              className="mt-6 text-sm text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
