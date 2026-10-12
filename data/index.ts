import type { Activity, LearningModule, ModuleInfo } from "@/types/learning";
import { englishActivities } from "./english";
import { numberActivities } from "./numbers";
import { readingActivities } from "./reading";
import { writingActivities } from "./writing";

export const modules: Record<LearningModule, ModuleInfo> = {
  reading: {
    id: "reading",
    title: "Membaca",
    subtitle: "Reading Garden",
    description: "Kenali huruf, huruf awal, suku kata, dan kata sederhana.",
    accentClass: "bg-sage",
    symbol: "Aa",
  },
  writing: {
    id: "writing",
    title: "Menulis",
    subtitle: "Writing Studio",
    description: "Telusuri garis dasar dan huruf dengan jari.",
    accentClass: "bg-yellow",
    symbol: "✎",
  },
  numbers: {
    id: "numbers",
    title: "Mengenal Angka",
    subtitle: "Number Garden",
    description: "Hitung benda, kenali angka, dan urutkan 1 sampai 10.",
    accentClass: "bg-sky",
    symbol: "123",
  },
  english: {
    id: "english",
    title: "Bahasa Inggris",
    subtitle: "English Corner",
    description: "Dengarkan kata bahasa Inggris dan cocokkan dengan gambar.",
    accentClass: "bg-beige",
    symbol: "Hi!",
  },
};

/** All activities, in the suggested order within each module. */
export const activities: Activity[] = [
  ...readingActivities,
  ...writingActivities,
  ...numberActivities,
  ...englishActivities,
];

export function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function getModuleActivities(module: LearningModule): Activity[] {
  return activities.filter((a) => a.module === module);
}

/** Next activity in the same module, or undefined after the last one. */
export function getNextActivity(activity: Activity): Activity | undefined {
  const list = getModuleActivities(activity.module);
  return list[list.indexOf(activity) + 1];
}
