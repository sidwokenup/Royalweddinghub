import { gsap } from "./index";

export interface HeroAnimationElements {
  container?: HTMLElement | null;
  overlay?: HTMLElement | null;
  eyebrow?: HTMLElement | null;
  titleLines?: HTMLElement[] | NodeListOf<HTMLElement> | null;
  subtitle?: HTMLElement | null;
  cta?: HTMLElement | null;
  framing?: HTMLElement[] | NodeListOf<HTMLElement> | null;
  scrollIndicator?: HTMLElement | null;
}

/**
 * Creates and plays the hero entrance animation sequence.
 * 
 * Sequence:
 * 1. Video is already visible immediately (no blocking).
 * 2. Subtle overlay & framing elements gently fade in.
 * 3. Eyebrow text fades upward.
 * 4. Main heading gently reveals with elegant stagger.
 * 5. Supporting text appears.
 * 6. BOOK NOW button appears last.
 * 7. Scroll indicator reveals.
 * 
 * Total sequence duration is ~1.1s - 1.3s for an intentional, royal, but responsive entrance.
 */
export function animateHeroEntrance(elements: HeroAnimationElements): gsap.core.Timeline | null {
  if (typeof window === "undefined") return null;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const {
    overlay,
    eyebrow,
    titleLines,
    subtitle,
    cta,
    framing,
    scrollIndicator,
  } = elements;

  if (prefersReducedMotion) {
    if (overlay) gsap.set(overlay, { opacity: 1 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
    if (titleLines) gsap.set(titleLines, { opacity: 1, y: 0 });
    if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
    if (cta) gsap.set(cta, { opacity: 1, y: 0 });
    if (framing) gsap.set(framing, { opacity: 1 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 1, y: 0 });
    return null;
  }

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  // Set initial states
  if (overlay) gsap.set(overlay, { opacity: 0 });
  if (framing) gsap.set(framing, { opacity: 0 });
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 14 });
  if (titleLines) gsap.set(titleLines, { opacity: 0, y: 22 });
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 16 });
  if (cta) gsap.set(cta, { opacity: 0, y: 14 });
  if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 10 });

  // 1. Overlay fades in smoothly
  if (overlay) {
    tl.to(overlay, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.05);
  }

  // 2. Luxury framing elements fade in
  if (framing) {
    tl.to(framing, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.15);
  }

  // 3. Eyebrow fades upward
  if (eyebrow) {
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.65 }, 0.25);
  }

  // 4. Main heading reveals
  if (titleLines && titleLines.length > 0) {
    tl.to(
      titleLines,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      },
      0.38
    );
  }

  // 5. Supporting text appears
  if (subtitle) {
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.65 }, 0.68);
  }

  // 6. BOOK NOW CTA appears last
  if (cta) {
    tl.to(cta, { opacity: 1, y: 0, duration: 0.65 }, 0.85);
  }

  // 7. Scroll indicator reveals
  if (scrollIndicator) {
    tl.to(scrollIndicator, { opacity: 1, y: 0, duration: 0.6 }, 1.0);
  }

  return tl;
}
