import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { FreshActivity } from "@/components/learning/FreshActivity";
import { activities, getActivity, getNextActivity, modules } from "@/data";
import { validateActivity } from "@/lib/validation";

export function generateStaticParams() {
  return activities.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/activity/[id]">): Promise<Metadata> {
  const activity = getActivity((await params).id);
  return { title: activity ? `${activity.title} — Little Learners` : "Little Learners" };
}

export default async function ActivityPage({ params }: PageProps<"/activity/[id]">) {
  const activity = getActivity((await params).id);
  if (!activity) notFound();

  const moduleHref = `/learn/${activity.module}`;
  const back = { href: moduleHref, label: modules[activity.module].title };
  const next = getNextActivity(activity);
  const problems = validateActivity(activity);

  return (
    <>
      <AppHeader back={back} />
      <PageContainer>
        {problems.length > 0 ? (
          <section className="card mx-auto max-w-xl p-6 text-center">
            <h1 className="text-2xl font-extrabold text-sage-dark">Aktivitas ini belum siap</h1>
            <p className="mt-2 text-lg">Ayo pilih aktivitas lain dulu, ya.</p>
          </section>
        ) : (
          <FreshActivity
            activity={activity}
            moduleHref={moduleHref}
            next={next ? { href: `/activity/${next.id}`, title: next.title } : undefined}
          />
        )}
      </PageContainer>
    </>
  );
}
