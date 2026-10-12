"use client";

import { useAppState } from "@/lib/app-store";
import { OFTEN_PRACTICED_COUNT } from "@/lib/progress-storage";
import { StorageNotice } from "./StorageNotice";
import { ActivityHistory } from "./ActivityHistory";
import { ProgressSummary } from "./ProgressSummary";

export function ProgressView() {
  const { ready, data, health } = useAppState();
  if (!ready) return <p className="text-lg text-muted">Memuat catatan belajar…</p>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-sage-dark">Catatan Belajar</h1>
        <p className="mt-1 text-lg text-ink">Ringkasan latihan di perangkat ini.</p>
      </div>
      <StorageNotice health={health} />

      <section aria-labelledby="summary-title" className="flex flex-col gap-3">
        <h2 id="summary-title" className="text-xl font-extrabold">Per area belajar</h2>
        <ProgressSummary progress={data.progress} />
      </section>

      <section aria-labelledby="history-title" className="flex flex-col gap-3">
        <h2 id="history-title" className="text-xl font-extrabold">Riwayat aktivitas</h2>
        <ActivityHistory progress={data.progress} />
      </section>

      <section aria-labelledby="labels-title" className="card p-5 text-base">
        <h2 id="labels-title" className="text-xl font-extrabold">Cara membaca status</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li><strong>Belum dicoba</strong>: aktivitas belum pernah dibuka.</li>
          <li><strong>Sedang berlatih</strong>: aktivitas sudah dimulai tetapi belum diselesaikan.</li>
          <li><strong>Sudah berlatih</strong>: aktivitas sudah diselesaikan minimal satu kali.</li>
          <li><strong>Sudah sering berlatih</strong>: diselesaikan {OFTEN_PRACTICED_COUNT} kali atau lebih.</li>
        </ul>
        <p className="mt-3 text-muted">
          Status hanya menghitung latihan yang selesai, bukan jumlah jawaban benar. Catatan ini bukan penilaian
          perkembangan anak dan tidak menunjukkan penguasaan suatu keterampilan.
        </p>
      </section>
    </div>
  );
}
