import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="items-center justify-center text-center">
      <h1 className="text-3xl font-extrabold text-sage-dark">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-lg">Ayo kembali ke beranda dan pilih aktivitas lain.</p>
      <Link href="/home" className="btn-primary mt-6">
        Ke Beranda
      </Link>
    </PageContainer>
  );
}
