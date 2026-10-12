"use client";

import Link from "next/link";
import { lockParentArea, useParentUnlocked } from "@/lib/parent-lock";

/** Header for parent pages: back to the child's home, plus a lock button once open. */
export function ParentAreaHeader() {
  const unlocked = useParentUnlocked();
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-4 sm:px-6">
      <Link href="/home" className="btn-secondary px-4" aria-label="Kembali ke beranda anak">
        <span aria-hidden="true" className="text-2xl leading-none">←</span>
        <span className="hidden sm:inline">Beranda anak</span>
      </Link>
      {unlocked && (
        <button type="button" className="btn-quiet" onClick={lockParentArea}>
          Kunci Pojok Orang Tua
        </button>
      )}
    </header>
  );
}
