import { activities, modules } from "@/data";
import { getProgressLabel } from "@/lib/progress-storage";
import type { ActivityProgress } from "@/types/progress";

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" });

/** Every activity with its practice label, most recently practiced first. */
export function ActivityHistory({ progress }: { progress: ActivityProgress[] }) {
  const byId = new Map(progress.map((p) => [p.activityId, p]));
  const rows = activities
    .map((a) => ({ activity: a, progress: byId.get(a.id) }))
    .sort((x, y) => (y.progress?.lastPracticedAt ?? "").localeCompare(x.progress?.lastPracticedAt ?? ""));

  return (
    <div className="card overflow-x-auto p-2 sm:p-4">
      <table className="w-full min-w-[34rem] text-left">
        <thead>
          <tr className="text-sm text-muted">
            <th scope="col" className="p-2 font-bold">Aktivitas</th>
            <th scope="col" className="p-2 font-bold">Status</th>
            <th scope="col" className="p-2 font-bold">Selesai</th>
            <th scope="col" className="p-2 font-bold">Terakhir berlatih</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ activity, progress: p }) => (
            <tr key={activity.id} className="border-t border-beige">
              <td className="p-2">
                <span className="block font-bold">{activity.title}</span>
                <span className="text-sm text-muted">{modules[activity.module].title}</span>
              </td>
              <td className="p-2 font-semibold text-sage-dark">{getProgressLabel(p)}</td>
              <td className="p-2">{p?.completedCount ? `${p.completedCount}×` : "–"}</td>
              <td className="p-2 text-sm">{p?.lastPracticedAt ? dateFormat.format(new Date(p.lastPracticedAt)) : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
