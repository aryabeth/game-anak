"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ActivityShell } from "./ActivityShell";

/**
 * Next.js keeps visited pages alive (hidden) between navigations. Opening an
 * activity from a link should start it fresh, while browser back/forward keeps
 * the child's place, so the shell is keyed on the router's bfcacheId.
 */
export function FreshActivity(props: ComponentProps<typeof ActivityShell>) {
  const { bfcacheId } = useRouter();
  return <ActivityShell key={`${props.activity.id}-${bfcacheId}`} {...props} />;
}
