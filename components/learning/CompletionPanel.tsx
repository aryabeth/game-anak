import Link from "next/link";

export function CompletionPanel({
  message,
  offlineTip,
  saveFailed,
  onRepeat,
  next,
  moduleHref,
}: {
  message: string;
  offlineTip?: string;
  saveFailed: boolean;
  onRepeat: () => void;
  next?: { href: string; title: string };
  moduleHref: string;
}) {
  return (
    <section className="card animate-fade-up mx-auto flex w-full max-w-xl flex-col items-center gap-5 p-6 text-center sm:p-10" aria-labelledby="done-title">
      <Sticker />
      <h2 id="done-title" className="text-3xl font-extrabold text-sage-dark">
        {message}
      </h2>
      <p className="text-lg text-muted">Kamu mendapat satu bintang karena sudah berlatih.</p>
      {saveFailed && (
        <p className="rounded-2xl bg-yellow px-4 py-2 text-sm font-semibold text-ink" role="status">
          Catatan: progres belum bisa disimpan di browser ini.
        </p>
      )}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn-secondary min-h-14" onClick={onRepeat}>
          ↺ Ulangi
        </button>
        <Link href={next?.href ?? moduleHref} className="btn-primary min-h-14">
          {next ? "Aktivitas Berikutnya →" : "Pilih Aktivitas Lain →"}
        </Link>
      </div>
      <Link href="/home" className="font-bold text-sage-dark underline underline-offset-4">
        Kembali ke Beranda
      </Link>
      {offlineTip && (
        <p className="w-full rounded-3xl bg-cream px-4 py-3 text-left text-base text-ink">
          <span className="font-extrabold text-sage-dark">Ide bermain tanpa layar: </span>
          {offlineTip}
        </p>
      )}
    </section>
  );
}

function Sticker() {
  return (
    <svg viewBox="0 0 120 120" className="animate-pop h-32 w-32" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="56" fill="#f3e6b5" />
      <path
        d="M60 22l11 23 25 3-18 17 5 25-23-12-23 12 5-25-18-17 25-3z"
        fill="#f2c230"
        stroke="#9c4f33"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="60" r="3" fill="#405641" />
      <circle cx="68" cy="60" r="3" fill="#405641" />
      <path d="M53 70c4 4 10 4 14 0" fill="none" stroke="#405641" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
