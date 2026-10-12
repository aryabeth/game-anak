import Link from "next/link";
import { WelcomeHero } from "@/components/home/WelcomeHero";
import { Logo } from "@/components/layout/Logo";

export default function WelcomePage() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-between gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <Logo size="lg" />
        <WelcomeHero className="w-full max-w-md" />
        <p className="max-w-md text-xl font-semibold text-ink">
          Ayo jelajahi huruf, garis, angka, dan kata bahasa Inggris dengan tenang.
        </p>
        <Link href="/home" className="btn-primary min-h-16 px-12 text-2xl">
          Mulai Belajar
        </Link>
      </div>

      <footer className="flex w-full flex-col items-center gap-2 border-t-2 border-beige pt-6 text-center">
        <p className="text-sm text-muted">Untuk orang tua dan pendamping</p>
        <Link href="/parent" className="btn-quiet text-base">
          Pojok Orang Tua
        </Link>
      </footer>
    </main>
  );
}
