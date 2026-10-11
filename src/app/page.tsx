import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full bg-[#0a0705]">
      <Navbar />
      <Hero />
      
      {/* Temporary Next Section */}
      <section 
        id="services" 
        className="relative w-full py-28 sm:py-36 px-6 bg-[#0e0a08] text-[#faf9f6] flex flex-col items-center justify-center text-center border-t border-[#f3e5d8]/10"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <small className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#d4af37] font-medium block">
            COMING NEXT
          </small>
          <h2 className="text-3xl sm:text-4xl md:text-5xl display-text font-normal text-white leading-tight">
            Extraordinary celebrations,<br className="hidden sm:inline" /> thoughtfully planned.
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-light text-[#faf9f6]/70 max-w-lg mx-auto leading-relaxed pt-2">
            The complete portfolio, bespoke destination services, and curated experiences will be introduced here.
          </p>
          <div className="pt-4">
            <Link
              href="/venues"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] hover:text-[#f3e5d8] transition-colors group border-b border-[#d4af37]/40 pb-1"
            >
              <span>Explore Curated Venues in Lucknow</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
