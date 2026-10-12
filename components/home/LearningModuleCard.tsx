import Link from "next/link";
import type { ModuleInfo } from "@/types/learning";

export function LearningModuleCard({ module, practiced, total }: { module: ModuleInfo; practiced: number; total: number }) {
  return (
    <Link
      href={`/learn/${module.id}`}
      className="card group flex min-h-40 items-center gap-4 p-5 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] sm:min-h-48 sm:flex-col sm:items-start sm:p-6"
    >
      <span
        aria-hidden="true"
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-3xl font-extrabold text-sage-dark ${module.accentClass}`}
      >
        {module.symbol}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-2xl font-extrabold text-ink">{module.title}</span>
        <span className="text-base font-bold text-muted">{module.subtitle}</span>
        <span className="mt-1 text-sm font-semibold text-sage-dark">
          {practiced > 0 ? `${practiced} dari ${total} aktivitas sudah dilatih` : `${total} aktivitas`}
        </span>
      </span>
    </Link>
  );
}
