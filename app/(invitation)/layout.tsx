import SmoothScroll from "@/components/SmoothScroll";

// Lenis-driven smooth scroll (transform-based, not native scrollTop) plus
// GSAP ScrollTrigger reveals are built for this one cinematic page. Scoped
// to this route group so /daftar-tamu — a plain data-entry tool — keeps
// normal native browser scrolling instead of inheriting an animation stack
// it doesn't use and that broke its layout (see commit history).
export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
