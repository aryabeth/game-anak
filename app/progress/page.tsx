import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { ParentAreaHeader } from "@/components/layout/ParentAreaHeader";
import { ParentGate } from "@/components/layout/ParentGate";
import { ProgressView } from "@/components/progress/ProgressView";

export const metadata: Metadata = { title: "Catatan Belajar — Little Learners" };

export default function ProgressPage() {
  return (
    <>
      <ParentAreaHeader />
      <PageContainer>
        <ParentGate>
          <ProgressView />
          <Link href="/parent" className="btn-secondary mt-8 self-start">
            ← Pojok Orang Tua
          </Link>
        </ParentGate>
      </PageContainer>
    </>
  );
}
