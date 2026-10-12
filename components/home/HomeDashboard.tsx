"use client";

import Link from "next/link";
import { activities, getActivity, getModuleActivities, modules } from "@/data";
import { useAppState } from "@/lib/app-store";
import { getActivityStatus } from "@/lib/progress-storage";
import { LEARNING_MODULES } from "@/types/learning";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { LearningModuleCard } from "./LearningModuleCard";

export function HomeDashboard() {
  const { ready, data } = useAppState();
  const nickname = data.profile.nickname;
  const last = ready && data.lastActivityId ? getActivity(data.lastActivityId) : undefined;
  const byId = new Map(data.progress.map((p) => [p.activityId, p]));
  const stars = data.progress.reduce((sum, p) => sum + p.completedCount, 0);
  const practicedIn = (activityIds: string[]) =>
    activityIds.filter((id) => getActivityStatus(byId.get(id)) === "practiced").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-sage-dark sm:text-4xl">
          Halo{ready && nickname ? `, ${nickname}` : ""}!
        </h1>
        <p className="text-xl font-semibold text-ink">Mau belajar apa hari ini?</p>
      </div>

      {last && <ContinueLearningCard activity={last} module={modules[last.module]} />}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Area belajar">
        {LEARNING_MODULES.map((id) => {
          const list = getModuleActivities(id);
          return (
            <li key={id}>
              <LearningModuleCard module={modules[id]} total={list.length} practiced={ready ? practicedIn(list.map((a) => a.id)) : 0} />
            </li>
          );
        })}
      </ul>

      {ready && stars > 0 && (
        <p className="flex items-center gap-2 self-start rounded-full bg-yellow px-4 py-2 text-lg font-bold text-ink">
          <StarIcon />
          {stars} bintang dari {practicedIn(activities.map((a) => a.id))} aktivitas yang sudah dilatih
        </p>
      )}

      <div className="mt-4 flex justify-center border-t-2 border-beige pt-6">
        <Link href="/parent" className="btn-quiet text-base">
          Pojok Orang Tua
        </Link>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8z" fill="#f2c230" stroke="#9c4f33" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
