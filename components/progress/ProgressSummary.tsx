import { getModuleActivities, modules } from "@/data";
import { getActivityStatus } from "@/lib/progress-storage";
import { LEARNING_MODULES } from "@/types/learning";
import type { ActivityProgress } from "@/types/progress";

export function ProgressSummary({ progress }: { progress: ActivityProgress[] }) {
  const byId = new Map(progress.map((p) => [p.activityId, p]));
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LEARNING_MODULES.map((m) => {
        const list = getModuleActivities(m);
        const practiced = list.filter((a) => getActivityStatus(byId.get(a.id)) === "practiced").length;
        const sessions = list.reduce((sum, a) => sum + (byId.get(a.id)?.completedCount ?? 0), 0);
        return (
          <li key={m} className="card flex items-center gap-4 p-4">
            <span
              aria-hidden="true"
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold text-sage-dark ${modules[m].accentClass}`}
            >
              {modules[m].symbol}
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-extrabold">{modules[m].title}</span>
              <span className="text-base text-ink">
                {practiced} dari {list.length} aktivitas sudah dilatih
              </span>
              <span className="text-sm text-muted">{sessions} kali selesai</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
