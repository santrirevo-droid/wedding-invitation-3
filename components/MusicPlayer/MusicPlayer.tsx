"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type MusicPlayerHandle = {
  play: () => void;
};

type MusicPlayerProps = {
  src?: string;
  className?: string;
};

const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  // PLACEHOLDER — no song ships with this template (the original was
  // licensed/personal to a specific couple). Add your own file at
  // public/music/wedding-song.mp3 (see README) or pass a different src.
  ({ src = "/music/wedding-song.mp3", className = "" }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    // tracks whether the tab itself paused playback (vs. the visitor
    // pressing the toggle), so a return to the tab only resumes music
    // that was actually playing before it was backgrounded
    const pausedByVisibilityRef = useRef(false);

    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // autoplay blocked or asset missing — the always-visible toggle
            // below is the guaranteed manual fallback
          });
      },
    }));

    // browsers refuse to play audio with sound until the visitor performs
    // some gesture on the page — there is no way to start truly on load, so
    // this listens for the visitor's very first tap/scroll/keypress
    // *anywhere*, not just the "Buka Undangan" button, so music starts as
    // close to instantly as the browser will allow. Not every gesture is
    // honoured on every mobile browser (in-app browsers like WhatsApp's or
    // Instagram's are especially inconsistent), which is exactly why the
    // toggle button below is always rendered rather than hidden until this
    // succeeds — it's the guaranteed fallback when this silently fails.
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      let unlocked = false;

      const tryPlay = () => {
        if (unlocked) return;
        audio
          .play()
          .then(() => {
            unlocked = true;
            setIsPlaying(true);
            removeGestureListeners();
          })
          .catch(() => {
            // still blocked — wait for the next gesture
          });
      };

      const gestureEvents = [
        "pointerdown",
        "touchstart",
        "touchend",
        "keydown",
        "wheel",
      ] as const;
      const removeGestureListeners = () => {
        gestureEvents.forEach((event) => window.removeEventListener(event, tryPlay));
      };

      gestureEvents.forEach((event) =>
        window.addEventListener(event, tryPlay, { once: true, passive: true })
      );

      // harmless if blocked; succeeds outright for returning visitors whose
      // browser already trusts this site enough to allow autoplay
      tryPlay();

      return () => {
        removeGestureListeners();
      };
    }, []);

    // stop the music the moment the visitor leaves the tab/browser (or
    // closes it), and pick back up if they return — mirrors how a physical
    // music box would fall silent once no one's there to hear it
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          if (!audio.paused) {
            pausedByVisibilityRef.current = true;
            audio.pause();
            setIsPlaying(false);
          }
        } else if (pausedByVisibilityRef.current) {
          pausedByVisibilityRef.current = false;
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };

      const stopOnLeave = () => {
        audio.pause();
        setIsPlaying(false);
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", stopOnLeave);
      window.addEventListener("beforeunload", stopOnLeave);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("pagehide", stopOnLeave);
        window.removeEventListener("beforeunload", stopOnLeave);
      };
    }, []);

    const toggle = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        pausedByVisibilityRef.current = false;
        audio.pause();
        setIsPlaying(false);
      }
    };

    return (
      <>
        <audio ref={audioRef} src={src} loop preload="none" />
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          className={[
            "flex h-11 w-11 items-center justify-center rounded-full",
            "border border-accent/45 bg-paper/80 text-accent-dark backdrop-blur-sm",
            "shadow-[0_10px_24px_-12px_rgba(122,90,46,0.45)] transition-transform duration-300 hover:scale-105",
            "cursor-pointer",
            className,
          ].join(" ")}
        >
          <span
            className={[
              "text-lg leading-none",
              isPlaying ? "animate-spin [animation-duration:4s]" : "",
            ].join(" ")}
          >
            ♪
          </span>
        </button>
      </>
    );
  }
);

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
