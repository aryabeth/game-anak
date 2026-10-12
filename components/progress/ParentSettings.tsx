"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { appActions, useAppState } from "@/lib/app-store";
import { StorageNotice } from "./StorageNotice";

export function ParentSettings() {
  const { ready, data, health } = useAppState();
  if (!ready) return <p className="text-lg text-muted">Memuat pengaturan…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-sage-dark">Pojok Orang Tua</h1>
        <p className="mt-1 text-lg text-ink">Pengaturan, catatan belajar, dan informasi privasi.</p>
      </div>
      <StorageNotice health={health} />

      <Link href="/progress" className="card flex items-center justify-between gap-4 p-5">
        <span>
          <span className="block text-xl font-extrabold">Catatan Belajar</span>
          <span className="text-base text-muted">Ringkasan latihan dan riwayat aktivitas</span>
        </span>
        <span aria-hidden="true" className="text-2xl text-sage-dark">→</span>
      </Link>

      <section className="card flex flex-col gap-4 p-5" aria-labelledby="profile-title">
        <h2 id="profile-title" className="text-xl font-extrabold">Profil anak</h2>
        <NicknameForm saved={data.profile.nickname ?? ""} />
      </section>

      <section className="card flex flex-col gap-2 p-5" aria-labelledby="sound-title">
        <h2 id="sound-title" className="text-xl font-extrabold">Suara</h2>
        <Toggle
          label="Suara instruksi dan kata"
          description="Menggunakan suara bawaan perangkat. Jika perangkat tidak punya suara untuk bahasa tersebut, tulisan tetap ditampilkan."
          checked={data.settings.audioEnabled}
          onChange={(v) => appActions.updateSettings({ audioEnabled: v })}
        />
        <Toggle
          label="Efek suara"
          description="Bunyi lembut saat menjawab cocok dan saat aktivitas selesai."
          checked={data.settings.soundEffectsEnabled}
          onChange={(v) => appActions.updateSettings({ soundEffectsEnabled: v })}
        />
      </section>

      <ResetProgress />

      <section className="card flex flex-col gap-3 p-5 text-base" aria-labelledby="privacy-title">
        <h2 id="privacy-title" className="text-xl font-extrabold">Privasi</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Tidak ada akun, iklan, pelacak pemasaran, atau fitur sosial.</li>
          <li>
            Data yang disimpan hanya: nama panggilan (opsional), pengaturan suara, dan catatan aktivitas (berapa kali
            dimulai/diselesaikan serta waktu terakhir berlatih).
          </li>
          <li>Data disimpan di browser perangkat ini (localStorage) dan tidak dikirim ke server mana pun.</li>
          <li>Progres tidak tersinkron ke perangkat atau browser lain, dan bisa hilang jika data browser dihapus.</li>
          <li>Aplikasi tidak memakai mikrofon atau kamera, dan tidak menilai pengucapan anak.</li>
          <li>Suara dibuat oleh fitur suara bawaan perangkat atau browser.</li>
        </ul>
      </section>
    </div>
  );
}

function NicknameForm({ saved }: { saved: string }) {
  const [value, setValue] = useState(saved);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const ok = appActions.setNickname(value);
        setMessage(ok ? "Tersimpan." : "Belum bisa disimpan di browser ini.");
      }}
    >
      <label htmlFor="nickname" className="font-bold">
        Nama panggilan (opsional)
      </label>
      <p id="nickname-help" className="-mt-2 text-sm text-muted">
        Dipakai untuk sapaan di beranda. Cukup nama panggilan, tidak perlu nama lengkap.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="nickname"
          aria-describedby="nickname-help"
          value={value}
          maxLength={20}
          autoComplete="off"
          onChange={(e) => {
            setValue(e.target.value);
            setMessage(null);
          }}
          className="min-h-12 flex-1 rounded-2xl border-2 border-sage-dark/30 bg-cream px-4 text-lg"
        />
        <button type="submit" className="btn-primary">
          Simpan
        </button>
      </div>
      <p className="min-h-6 text-sm font-semibold text-sage-dark" role="status">
        {message}
      </p>
    </form>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-beige py-3 first-of-type:border-t-0">
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-12 w-20 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors ${
          checked ? "border-sage-dark bg-sage-dark" : "border-muted/40 bg-beige"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute h-9 w-9 rounded-full bg-surface shadow transition-[left] ${checked ? "left-9" : "left-1"}`}
        />
        <span className="sr-only">{checked ? "Aktif" : "Mati"}</span>
        <span aria-hidden="true" className={`absolute text-xs font-extrabold ${checked ? "left-2.5 text-cream" : "right-2 text-ink"}`}>
          {checked ? "ON" : "OFF"}
        </span>
      </button>
    </div>
  );
}

function ResetProgress() {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Do not leave the confirmation open when this page is hidden.
  useLayoutEffect(() => {
    return () => {
      setConfirming(false);
      setMessage(null);
    };
  }, []);

  return (
    <section className="card flex flex-col gap-3 p-5" aria-labelledby="reset-title">
      <h2 id="reset-title" className="text-xl font-extrabold">Hapus progres</h2>
      <p className="text-base text-muted">
        Menghapus semua catatan aktivitas dan bintang di browser ini. Nama panggilan dan pengaturan suara tetap ada.
      </p>
      {confirming ? (
        <div className="flex flex-col gap-3 rounded-3xl border-2 border-terracotta-dark/50 bg-cream p-4" role="alertdialog" aria-labelledby="reset-confirm">
          <p id="reset-confirm" className="font-bold">
            Yakin ingin menghapus semua progres? Tindakan ini tidak bisa dibatalkan.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                const ok = appActions.resetProgress();
                setConfirming(false);
                setMessage(
                  ok
                    ? "Progres sudah dihapus."
                    : "Progres dihapus untuk sesi ini, tetapi browser tidak mengizinkan penyimpanan.",
                );
              }}
            >
              Ya, hapus progres
            </button>
            <button type="button" className="btn-secondary" onClick={() => setConfirming(false)}>
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn-secondary self-start"
          onClick={() => {
            setMessage(null);
            setConfirming(true);
          }}
        >
          Hapus progres…
        </button>
      )}
      <p className="min-h-6 text-sm font-semibold text-sage-dark" role="status">
        {message}
      </p>
    </section>
  );
}
