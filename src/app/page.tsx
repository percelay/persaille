export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 md:px-16">
        <span className="text-xl font-bold tracking-tight">persaille</span>
        <a
          href="mailto:hello@persaille.com"
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Get in touch
        </a>
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
          <p className="text-lg text-neutral-400 leading-relaxed">
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
    </div>
  );
}
