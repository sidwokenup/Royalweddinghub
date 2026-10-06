import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <Hero />
      
      {/* Placeholder section below hero */}
      <section className="w-full py-32 px-6 flex flex-col items-center justify-center bg-background text-foreground text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-sm uppercase tracking-widest text-muted">The Experience</span>
          <h2 className="text-4xl md:text-5xl display-text">Editorial elegance meets cultural richness</h2>
          <p className="text-lg font-light leading-relaxed text-muted">
            We specialize in creating bespoke, immersive wedding experiences that honor tradition while embracing contemporary luxury. Every detail is curated to reflect your unique story.
          </p>
        </div>
      </section>
    </main>
  );
}
