import Link from "next/link";
import { Logo } from "./Logo";

export interface BackLink {
  href: string;
  label: string;
}

/** Top bar with a back control and a home control. */
export function AppHeader({ back, showHome = true }: { back?: BackLink; showHome?: boolean }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {back ? (
          <Link href={back.href} className="btn-secondary px-4" aria-label={`Kembali ke ${back.label}`}>
            <span aria-hidden="true" className="text-2xl leading-none">
              ←
            </span>
            <span className="hidden sm:inline">{back.label}</span>
          </Link>
        ) : (
          <Link href="/home" aria-label="Little Learners, ke beranda" className="rounded-2xl">
            <Logo />
          </Link>
        )}
      </div>
      {showHome && back && (
        <Link href="/home" className="btn-quiet" aria-label="Ke beranda">
          <HomeIcon />
          <span className="hidden sm:inline">Beranda</span>
        </Link>
      )}
    </header>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      <path
        d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
