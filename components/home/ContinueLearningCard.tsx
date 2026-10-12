import Link from "next/link";
import type { Activity, ModuleInfo } from "@/types/learning";

export function ContinueLearningCard({ activity, module }: { activity: Activity; module: ModuleInfo }) {
  return (
    <Link
      href={`/activity/${activity.id}`}
      className="card flex items-center justify-between gap-4 border-4 border-yellow p-5 transition-transform duration-150 active:scale-[0.98]"
    >
      <span className="flex flex-col">
        <span className="text-sm font-bold tracking-wide text-muted uppercase">Lanjutkan belajar</span>
        <span className="text-2xl font-extrabold text-ink">{activity.title}</span>
        <span className="text-base font-semibold text-muted">{module.title}</span>
      </span>
      <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-dark text-2xl text-cream">
        ▶
      </span>
    </Link>
  );
}
