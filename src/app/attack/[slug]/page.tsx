import { notFound } from "next/navigation";
import {
  getAttackBySlug,
  getAdjacentAttacks,
  ALL_ATTACKS,
} from "@/lib/data/attacks";
import { AttackPageClient } from "@/components/attack-detail/AttackPageClient";

export function generateStaticParams() {
  return ALL_ATTACKS.map((attack) => ({
    slug: attack.slug,
  }));
}

export default async function AttackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attack = getAttackBySlug(slug);

  if (!attack) {
    notFound();
  }

  const { prev, next } = getAdjacentAttacks(slug);

  return <AttackPageClient attack={attack} prev={prev} next={next} />;
}
