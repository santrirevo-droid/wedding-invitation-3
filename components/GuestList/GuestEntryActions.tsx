"use client";

const ICON_PROPS = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
};

function WhatsAppIcon() {
  return (
    <svg {...ICON_PROPS} fill="currentColor">
      <path d="M12 2.2c-5.4 0-9.8 4.4-9.8 9.8 0 1.75.46 3.4 1.27 4.83L2.2 21.8l5.1-1.24A9.75 9.75 0 0 0 12 21.8c5.4 0 9.8-4.4 9.8-9.8s-4.4-9.8-9.8-9.8Zm5.1 13.86c-.22.6-1.26 1.16-1.74 1.2-.46.05-.9.23-2.98-.62-2.53-1.02-4.18-3.57-4.3-3.74-.13-.17-1.02-1.36-1.02-2.6 0-1.23.65-1.83.88-2.08.22-.25.49-.3.66-.3.16 0 .33 0 .47.01.16.01.36-.06.55.42.22.52.73 1.8.79 1.93.06.13.1.28.02.45-.08.17-.13.27-.25.42-.13.15-.27.33-.38.45-.13.13-.26.27-.11.52.15.26.66 1.09 1.42 1.77.98.88 1.81 1.15 2.07 1.28.26.13.4.11.55-.07.15-.17.64-.75.81-1.01.17-.26.34-.21.56-.13.22.09 1.44.68 1.68.8.25.13.41.19.47.3.06.11.06.62-.16 1.22Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5V5.5A2 2 0 0 0 13.5 3.5h-8A2 2 0 0 0 3.5 5.5v8a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

const iconButtonBase =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors";

export default function GuestEntryActions({
  guestName,
  copied,
  onShareWhatsApp,
  onCopyLink,
  onDelete,
}: {
  guestName: string;
  copied: boolean;
  onShareWhatsApp: () => void;
  onCopyLink: () => void;
  /** Omitted on the read-only /rekap view, which has no delete action. */
  onDelete?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onShareWhatsApp}
        aria-label={`Kirim undangan WhatsApp untuk ${guestName}`}
        title="Kirim WhatsApp"
        className={`${iconButtonBase} bg-sage text-white hover:brightness-95`}
      >
        <WhatsAppIcon />
      </button>
      <button
        type="button"
        onClick={onCopyLink}
        aria-label={`Salin tautan undangan untuk ${guestName}`}
        title={copied ? "Tersalin!" : "Salin link"}
        className={`${iconButtonBase} border border-border text-ink hover:bg-maroon`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Hapus ${guestName} dari daftar`}
          title="Hapus"
          className={`${iconButtonBase} border border-border text-ink-soft hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}
