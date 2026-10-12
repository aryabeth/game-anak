import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { ModuleActivityList } from "@/components/learning/ModuleActivityList";
import { getModuleActivities, modules } from "@/data";
import { LEARNING_MODULES, type LearningModule } from "@/types/learning";

export function generateStaticParams() {
  return LEARNING_MODULES.map((module) => ({ module }));
}

function isModule(value: string): value is LearningModule {
  return (LEARNING_MODULES as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: PageProps<"/learn/[module]">): Promise<Metadata> {
  const { module } = await params;
  return { title: isModule(module) ? `${modules[module].title} — Little Learners` : "Little Learners" };
}

export default async function ModulePage({ params }: PageProps<"/learn/[module]">) {
  const { module } = await params;
  if (!isModule(module)) notFound();
  const info = modules[module];
  const list = getModuleActivities(module).map(({ id, title, summary }) => ({ id, title, summary }));

  return (
    <>
      <AppHeader back={{ href: "/home", label: "Beranda" }} />
      <PageContainer>
        <div className="mb-6 flex items-center gap-4">
          <span
            aria-hidden="true"
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-3xl font-extrabold text-sage-dark ${info.accentClass}`}
          >
            {info.symbol}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-sage-dark sm:text-4xl">{info.title}</h1>
            <p className="text-base font-bold text-muted">{info.subtitle}</p>
            <p className="mt-1 text-lg text-ink">{info.description}</p>
          </div>
        </div>
        <ModuleActivityList activities={list} />
      </PageContainer>
    </>
  );
}
