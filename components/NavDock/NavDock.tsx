"use client";

import { useEffect, useState, type JSX } from "react";
import { useLenis } from "lenis/react";
import { easeInOutCubic } from "@/lib/easing";
import { stopAutoScrollTour } from "@/hooks/useOpenInvitation";

type NavItem = {
  id: string;
  label: string;
  icon: JSX.Element;
};

const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const items: NavItem[] = [
  {
    id: "mempelai",
    label: "Mempelai",
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="9" cy="14" r="6" />
        <circle cx="15" cy="14" r="6" />
      </svg>
    ),
  },
  {
    id: "kisah-kami",
    label: "Kisah Kami",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 6c-1.8-1.3-4-2-6.5-2A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 1 5.5 16c2.5 0 4.7.7 6.5 2" />
        <path d="M12 6c1.8-1.3 4-2 6.5-2A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 0-2.5-2c-2.5 0-4.7.7-6.5 2" />
        <path d="M12 6v12" />
      </svg>
    ),
  },
  {
    id: "acara",
    label: "Waktu & Tempat",
    icon: (
      // a map pin (à la Google Maps) — "Waktu & Tempat" is a venue with a
      // "Lihat Lokasi" link, so a pin reads as the section's actual
      // purpose more directly than a calendar page would
      <svg {...ICON_PROPS}>
        <path d="M12 21s-7-6.4-7-11.2A7 7 0 0 1 19 9.8C19 14.6 12 21 12 21Z" />
        <circle cx="12" cy="9.8" r="2.4" />
      </svg>
    ),
  },
  {
    id: "rsvp",
    label: "Konfirmasi Kehadiran",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="M3.5 6.5 12 13l8.5-6.5" />
      </svg>
    ),
  },
  {
    id: "tanda-kasih",
    label: "Tanda Kasih",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3.5" y="10" width="17" height="10" rx="1.5" />
        <path d="M3.5 14h17M12 10v10" />
        <path d="M12 10c-1.8 0-3.6-1-3.6-2.8A2.2 2.2 0 0 1 10.6 5c1.4 0 1.9 1.6 1.4 3M12 10c1.8 0 3.6-1 3.6-2.8A2.2 2.2 0 0 0 13.4 5c-1.4 0-1.9 1.6-1.4 3" />
      </svg>
    ),
  },
  {
    id: "ucapan",
    label: "Ucapan & Doa",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4 3.5V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
];

type NavDockProps = {
  // scroll is locked to the cover until "Buka Undangan" is pressed, so
  // jumping to a section is impossible before then — stay hidden until
  // the invitation is actually opened rather than show a dead control
  enabled: boolean;
};

/**
 * A quick-nav bar, visible only on the cover once it's opened — it exists
 * so a guest can jump straight to a section, then gets out of the way once
 * they've actually started scrolling through it (so it never sits over the
 * "Buka Undangan" button or any section beneath the cover). Its own
 * visibility follows the same #cover element useScrollReveal pins, so it
 * fades in step with the cover: still up through the pin-and-reveal
 * transition, gone once #cover has actually scrolled past.
 *
 * Stuck flush to the bottom edge (not a floating pill) so it reads as part
 * of the cover's frame rather than an overlay competing with the CTA.
 *
 * Rendered once in Hero, next to MusicPlayer, as a sibling of #cover (not
 * a descendant — see the comment in Hero.tsx on why).
 */
export default function NavDock({ enabled }: NavDockProps) {
  const lenis = useLenis();
  const [coverVisible, setCoverVisible] = useState(true);
  const visible = coverVisible && enabled;

  useEffect(() => {
    const cover = document.getElementById("cover");
    if (!cover) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCoverVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(cover);
    return () => observer.disconnect();
  }, []);

  function goTo(id: string) {
    // a direct jump always wins over the cover's autoplay tour, so the two
    // scrolls never fight over lenis mid-hop
    stopAutoScrollTour();

    const el = document.getElementById(id);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { duration: 1.2, easing: easeInOutCubic });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    // Faded with opacity/pointer-events rather than unmounted: unmounting
    // would tear down and re-create the IntersectionObserver on every
    // cover enter/exit, and a CSS fade reads as the bar settling out of
    // the way rather than snapping off.
    <nav
      aria-label="Navigasi ke bagian undangan"
      aria-hidden={!visible}
      className={[
        "fixed inset-x-0 bottom-0 z-20 transition-opacity duration-500",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <div
        className="mx-auto flex max-w-md items-center justify-between gap-1 border-t border-accent/25 bg-paper/90 px-3 backdrop-blur-sm shadow-[0_-12px_28px_-18px_rgba(122,90,46,0.45)]"
        style={{ paddingTop: "0.625rem", paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            tabIndex={visible ? 0 : -1}
            aria-label={item.label}
            onClick={() => goTo(item.id)}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gold-dark transition-colors duration-300 hover:bg-accent/15 sm:h-10 sm:w-10"
          >
            {item.icon}
          </button>
        ))}
      </div>
    </nav>
  );
}
