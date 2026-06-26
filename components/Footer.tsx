import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--b)] bg-[var(--bg2)] text-[var(--t2)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              Loka<span className="text-[var(--red)]">yantra</span>
            </Link>
            <p className="text-xs text-[var(--t3)] mt-1">
              Free browser games, instant play, no downloads.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--b)] text-xs text-[var(--t3)] text-center sm:text-left">
          © {new Date().getFullYear()} Lokayantra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}