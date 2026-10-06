import { gsap } from "@/animations/gsap";

/**
 * Transition between concierge steps with an editorial card flip / page turn effect
 */
export function transitionConciergeStep(
  targetElement: HTMLElement | null,
  onMidpoint: () => void
): void {
  if (!targetElement) {
    onMidpoint();
    return;
  }

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onMidpoint();
    return;
  }

  const tl = gsap.timeline();

  // Outward transition: gentle lift and fade
  tl.to(targetElement, {
    opacity: 0,
    y: -14,
    scale: 0.985,
    duration: 0.22,
    ease: "power2.in",
    onComplete: () => {
      onMidpoint();
      // Reset position slightly below for entrance
      gsap.set(targetElement, { y: 16, scale: 0.985, opacity: 0 });
    },
  });

  // Inward transition: elegant reveal like turning a luxury parchment invitation
  tl.to(targetElement, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.38,
    ease: "power3.out",
  });
}
