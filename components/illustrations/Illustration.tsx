import type { ColorId, IllustrationId } from "@/types/learning";

/*
 * Original, simple SVG illustrations drawn for this app (no third-party assets).
 * All share a 100 × 100 viewBox, a soft fill palette, and the same outline.
 */

const LINE = "#405641";
const common = { stroke: LINE, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const drawings: Record<IllustrationId, React.ReactNode> = {
  apple: (
    <>
      <path d="M50 30c-8-6-30-6-30 18 0 20 14 36 24 36 3 0 4-2 6-2s3 2 6 2c10 0 24-16 24-36 0-24-22-24-30-18z" fill="#d9705a" {...common} />
      <path d="M50 30c0-8 2-14 6-18" fill="none" {...common} />
      <path d="M54 20c6-8 16-8 20-4-4 6-12 8-20 4z" fill="#8fb487" {...common} />
    </>
  ),
  ball: (
    <>
      <circle cx="50" cy="52" r="34" fill="#7fa8d1" {...common} />
      <path d="M18 44c20 8 44 8 64 0M22 70c18-10 38-10 56 0" fill="none" {...common} />
      <path d="M50 18v68" fill="none" {...common} />
    </>
  ),
  bag: (
    <>
      <path d="M36 34c0-12 28-12 28 0" fill="none" {...common} />
      <rect x="18" y="34" width="64" height="50" rx="10" fill="#d58c70" {...common} />
      <path d="M18 52h64" fill="none" {...common} />
      <rect x="44" y="47" width="12" height="10" rx="3" fill="#f3e6b5" {...common} />
    </>
  ),
  banana: (
    <>
      <path d="M22 30c2 30 26 48 58 40 4-1 4-6 0-7-24 4-40-10-44-34-1-6-14-6-14 1z" fill="#f2cf5b" {...common} />
      <path d="M22 30l-4-8" fill="none" {...common} />
    </>
  ),
  bird: (
    <>
      <ellipse cx="48" cy="56" rx="28" ry="22" fill="#8fbfd9" {...common} />
      <circle cx="64" cy="38" r="14" fill="#8fbfd9" {...common} />
      <path d="M77 36l12 4-12 5z" fill="#f2cf5b" {...common} />
      <circle cx="66" cy="35" r="2.5" fill={LINE} />
      <path d="M30 54c8 12 22 12 26 2" fill="#c9e0ec" {...common} />
      <path d="M40 78l-2 8M54 78l2 8" fill="none" {...common} />
    </>
  ),
  book: (
    <>
      <path d="M14 26c12-4 24-4 36 4v52c-12-8-24-8-36-4z" fill="#f7f1e3" {...common} />
      <path d="M86 26c-12-4-24-4-36 4v52c12-8 24-8 36-4z" fill="#a7c49a" {...common} />
      <path d="M22 40c6-2 14-1 20 2M22 52c6-2 14-1 20 2" fill="none" {...common} strokeWidth={2} />
    </>
  ),
  bread: (
    <>
      <path d="M18 48c-6-16 10-26 32-26s38 10 32 26v30c0 4-3 6-6 6H24c-3 0-6-2-6-6z" fill="#d9a466" {...common} />
      <path d="M36 40l6 8M50 36l6 8M64 40l6 8" fill="none" {...common} strokeWidth={2.5} />
    </>
  ),
  cat: (
    <>
      <path d="M22 40l2-26 18 14h16l18-14 2 26c4 8 4 16 0 24-6 14-20 20-28 20s-22-6-28-20c-4-8-4-16 0-24z" fill="#e9b98a" {...common} />
      <circle cx="38" cy="50" r="3" fill={LINE} />
      <circle cx="62" cy="50" r="3" fill={LINE} />
      <path d="M46 60h8l-4 4z" fill="#d58c70" {...common} strokeWidth={2} />
      <path d="M50 64v4M14 58h18M14 66l18-3M86 58H68M86 66l-18-3" fill="none" {...common} strokeWidth={2} />
    </>
  ),
  cow: (
    <>
      <path d="M26 24l-8-8M74 24l8-8" fill="none" {...common} />
      <path d="M22 30c0-6 6-10 12-10h32c6 0 12 4 12 10v24H22z" fill="#ffffff" {...common} />
      <path d="M30 24c6 2 8 8 4 12-4 2-8 0-10-4M66 22c-4 4-2 10 4 12" fill="#5d5a52" stroke="none" />
      <path d="M12 34l10 4M88 34l-10 4" fill="none" {...common} />
      <rect x="24" y="52" width="52" height="30" rx="15" fill="#f1b9a6" {...common} />
      <circle cx="40" cy="44" r="3" fill={LINE} />
      <circle cx="60" cy="44" r="3" fill={LINE} />
      <circle cx="40" cy="66" r="3" fill={LINE} />
      <circle cx="60" cy="66" r="3" fill={LINE} />
    </>
  ),
  cup: (
    <>
      <path d="M22 32h48l-6 46c0 4-4 6-8 6H36c-4 0-8-2-8-6z" fill="#dceaf3" {...common} />
      <path d="M68 42c12-2 16 6 12 14-3 6-10 8-14 6" fill="none" {...common} />
      <path d="M38 16c-4 4 4 8 0 12M52 16c-4 4 4 8 0 12" fill="none" {...common} strokeWidth={2} />
    </>
  ),
  dog: (
    <>
      <path d="M28 30c0-8 10-14 22-14s22 6 22 14v24c0 16-10 28-22 28S28 70 28 54z" fill="#d9b38c" {...common} />
      <path d="M28 28c-10 0-16 14-12 30 6 2 12-6 14-14M72 28c10 0 16 14 12 30-6 2-12-6-14-14" fill="#9a6f4c" {...common} />
      <circle cx="40" cy="44" r="3" fill={LINE} />
      <circle cx="60" cy="44" r="3" fill={LINE} />
      <ellipse cx="50" cy="60" rx="7" ry="5" fill={LINE} />
      <path d="M50 65v5c-4 4-8 2-10 0M50 70c4 4 8 2 10 0" fill="none" {...common} strokeWidth={2} />
    </>
  ),
  eye: (
    <>
      <path d="M10 50c12-20 28-28 40-28s28 8 40 28c-12 20-28 28-40 28S22 70 10 50z" fill="#ffffff" {...common} />
      <circle cx="50" cy="50" r="16" fill="#8b6a4a" {...common} />
      <circle cx="50" cy="50" r="7" fill={LINE} />
      <circle cx="55" cy="45" r="3" fill="#ffffff" />
    </>
  ),
  fish: (
    <>
      <path d="M14 50c12-18 30-24 48-16 8 4 14 10 18 16-4 6-10 12-18 16-18 8-36 2-48-16z" fill="#f0a77f" {...common} />
      <path d="M78 50l12-14v28z" fill="#f0a77f" {...common} />
      <circle cx="30" cy="46" r="3" fill={LINE} />
      <path d="M48 38c4 8 4 16 0 24" fill="none" {...common} strokeWidth={2} />
    </>
  ),
  flower: (
    <>
      <path d="M50 58v32M50 76c-8-8-18-8-20-4 4 6 12 8 20 4z" fill="#8fb487" {...common} />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="22"
          rx="10"
          ry="14"
          transform={`rotate(${deg} 50 38)`}
          fill="#f2b8c6"
          {...common}
        />
      ))}
      <circle cx="50" cy="38" r="9" fill="#f2cf5b" {...common} />
    </>
  ),
  hat: (
    <>
      <path d="M24 64c0-20 12-34 26-34s26 14 26 34z" fill="#7fa8d1" {...common} />
      <path d="M14 64h72c2 0 4 4 0 6-12 6-60 6-72 0-4-2-2-6 0-6z" fill="#5d8dbd" {...common} />
      <circle cx="50" cy="28" r="5" fill="#f2cf5b" {...common} />
    </>
  ),
};

/** Indonesian names, used as accessible labels. */
export const illustrationNames: Record<IllustrationId, string> = {
  apple: "apel",
  ball: "bola",
  bag: "tas",
  banana: "pisang",
  bird: "burung",
  book: "buku",
  bread: "roti",
  cat: "kucing",
  cow: "sapi",
  cup: "cangkir",
  dog: "anjing",
  eye: "mata",
  fish: "ikan",
  flower: "bunga",
  hat: "topi",
};

export function Illustration({
  id,
  label,
  className,
}: {
  id: IllustrationId;
  /** Accessible name; pass an empty string for decorative use. */
  label?: string;
  className?: string;
}) {
  const name = label ?? illustrationNames[id];
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      focusable="false"
    >
      {drawings[id]}
    </svg>
  );
}

export const swatchColors: Record<ColorId, string> = {
  red: "#d9473a",
  blue: "#3f7cc4",
  yellow: "#f2c230",
  green: "#4e9a51",
};

/** A paint-blob swatch for color vocabulary. */
export function ColorSwatch({ color, label, className }: { color: ColorId; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path
        d="M50 12c18 0 34 10 36 28 2 16-6 22-4 34 1 10-12 16-30 14-20-2-38-8-38-30 0-26 16-46 36-46z"
        fill={swatchColors[color]}
        {...common}
      />
    </svg>
  );
}
