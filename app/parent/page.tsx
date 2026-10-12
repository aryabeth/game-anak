import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { ParentAreaHeader } from "@/components/layout/ParentAreaHeader";
import { ParentGate } from "@/components/layout/ParentGate";
import { ParentSettings } from "@/components/progress/ParentSettings";

export const metadata: Metadata = { title: "Pojok Orang Tua — Little Learners" };

export default function ParentPage() {
  return (
    <>
      <ParentAreaHeader />
      <PageContainer>
        <ParentGate>
          <ParentSettings />
        </ParentGate>
      </PageContainer>
    </>
  );
}
