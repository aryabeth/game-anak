"use client";

import Link from "next/link";
import { useAppState } from "@/lib/app-store";
import { getActivityStatus, getProgressLabel } from "@/lib/progress-storage";
import type { Activity } from "@/types/learning";

/**
 * Activity cards for a module. All activities stay open; the first one not yet
 * practiced is marked as a suggestion rather than locking the others.
 */
export function ModuleActivityList({ activities }: { activities: Pick<Activity, "id" | "title" | "summary">[] }) {
  const { ready, data } = useAppState();
  const byId = new Map(data.progress.map((p) => [p.activityId, p]));
  const suggested =
    activities.find((a) => getActivityStatus(byId.get(a.id)) !== "practiced")?.id ?? activities[0]?.id;

  if (activities.length === 0) {
    return <p className="card p-6 text-lg">Aktivitas untuk bagian ini sedang disiapkan.</p>;
  }

  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {activities.map((a, i) => {
        const progress = byId.get(a.id);
        const status = getActivityStatus(progress);
        const isSuggested = ready && a.id === suggested;
        return (
          <li key={a.id}>
            <Link
              href={`/activity/${a.id}`}
              className={`card flex h-full items-start gap-4 p-5 transition-transform duration-150 active:scale-[0.98] ${
                isSuggested ? "border-4 border-yellow" : "border-4 border-transparent"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold ${
                  status === "practiced" ? "bg-sage-dark text-cream" : "bg-sage text-sage-dark"
                }`}
              >
                {status === "practiced" ? "★" : i + 1}
              </span>
              <span className="flex flex-col gap-1">
                {isSuggested && (
                  <span className="self-start rounded-full bg-yellow px-3 py-0.5 text-sm font-bold text-ink">Saran mulai</span>
                )}
                <span className="text-xl font-extrabold text-ink">{a.title}</span>
                <span className="text-base text-muted">{a.summary}</span>
                {ready && <span className="text-sm font-bold text-sage-dark">{getProgressLabel(progress)}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
