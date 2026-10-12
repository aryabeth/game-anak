import type { StorageHealth } from "@/types/progress";

export function StorageNotice({ health }: { health: StorageHealth }) {
  if (health === "ok") return null;
  return (
    <p className="rounded-3xl border-2 border-terracotta/50 bg-yellow px-4 py-3 text-base font-semibold" role="status">
      {health === "recovered"
        ? "Data progres yang tersimpan tidak bisa dibaca, jadi aplikasi memulai catatan baru."
        : "Browser ini tidak mengizinkan penyimpanan. Progres hanya tersimpan sampai halaman ditutup atau dimuat ulang."}
    </p>
  );
}
