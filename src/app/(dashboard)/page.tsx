import Link from "next/link";
import { ArrowUpRight, CalendarClock, Newspaper, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getClientCurrentDay, getLatestNewsForUser } from "@/lib/platform";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await requireUser();
  const [currentLesson, newsItems] = await Promise.all([getClientCurrentDay(user.id), getLatestNewsForUser(user.id, 8)]);
  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Главная"
          title="Добро пожаловать в личный кабинет"
          description="Все ключевые материалы курса, расписание и документы в одном аккуратном пространстве."
        />
      </FadeIn>

      <div className="grid gap-5 xl:grid-cols-3">
        <FadeIn delay={0.05} className="xl:col-span-2">
          <SectionCard className="h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <CalendarClock size={14} />
                  Текущий учебный день
                </p>
                {currentLesson ? (
                  <>
                    <h3 className="text-xl font-semibold">{currentLesson.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{currentLesson.description}</p>
                    <p className="mt-4 text-sm font-medium">
                      Начало: {currentLesson.date.toLocaleDateString("ru-RU")} в {currentLesson.startAt}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Пока нет назначенного текущего дня. Администратор добавит вас к ближайшему потоку.
                  </p>
                )}
              </div>
              {currentLesson ? (
                <Link href={`/learning/${currentLesson.slug}`} className={cn(buttonVariants(), "rounded-xl")}>
                  Перейти
                </Link>
              ) : null}
            </div>
          </SectionCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionCard className="h-full">
            <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles size={14} />
              Быстрые переходы
            </p>
            <div className="space-y-2">
              {[
                { href: "/learning", title: "Открыть обучение" },
                { href: "/schedule", title: "Посмотреть расписание" },
                { href: "/documents", title: "Перейти к документам" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium transition hover:bg-white"
                >
                  {item.title}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </SectionCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.15}>
        <SectionCard className="h-full">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium">
            <Newspaper size={16} /> Лента новостей
          </p>
          <div className="space-y-4">
            {newsItems.map((news) => (
              <article key={news.id} className="rounded-2xl bg-white/80 p-5">
                <h4 className="text-base font-semibold">{news.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{news.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {news.publishedAt.toLocaleDateString("ru-RU")}
                </p>
              </article>
            ))}
            {!newsItems.length ? (
              <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-muted-foreground">
                Пока нет опубликованных новостей.
              </p>
            ) : null}
          </div>
        </SectionCard>
      </FadeIn>
    </div>
  );
}
