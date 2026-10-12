import type { Metadata } from "next";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = { title: "Beranda — Little Learners" };

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <PageContainer>
        <HomeDashboard />
      </PageContainer>
    </>
  );
}
