import Link from "next/link";
import { Calendar, ChevronRight, Lock } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getClientDays } from "@/lib/platform";
import { cn } from "@/lib/utils";

export default async function LearningPage() {
  const user = await requireUser();
  const learningDays = await getClientDays(user.id);

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Обучение"
          title="Программа по дням"
          description="Каждый учебный день содержит описание, время старта и быстрый переход к деталям урока."
        />
      </FadeIn>

      <div className="grid gap-4">
        {!learningDays.length ? (
          <SectionCard>
            <p className="text-sm text-muted-foreground">
              Вы еще не добавлены в обучение. Обратитесь к администратору потока.
            </p>
          </SectionCard>
        ) : null}
        {learningDays.map((day, index) => (
          <FadeIn key={day.id} delay={0.05 * (index + 1)}>
            <SectionCard>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <Calendar size={14} />
                    День {day.dayNumber} • {day.date.toLocaleDateString("ru-RU")}
                  </p>
                  <h3 className="text-lg font-semibold">{day.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{day.description}</p>
                </div>
                {day.isUnlocked ? (
                  <Link
                    href={`/learning/${day.slug}`}
                    className={cn(buttonVariants(), "rounded-xl")}
                  >
                    {day.isCurrent ? "Текущий день" : "Открытый день"} <ChevronRight size={16} />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-200 px-4 py-2 text-sm text-zinc-600">
                    <Lock size={16} />
                    Откроется в следующих днях
                  </span>
                )}
              </div>
            </SectionCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
