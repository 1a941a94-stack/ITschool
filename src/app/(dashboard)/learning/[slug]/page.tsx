import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, FileDown, Link2, PlayCircle } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { CareerManagerCard } from "@/components/learning/career-manager-card";
import { TrainerMaterialFeed } from "@/components/learning/trainer-material-feed";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getClientEnrollment, materialKindLabel, parseAgenda } from "@/lib/platform";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await requireUser();
  const enrollment = await getClientEnrollment(user.id);
  if (!enrollment) notFound();

  const { slug } = await params;
  const lesson = enrollment.cohort.days.find((day) => day.slug === slug);

  if (!lesson) {
    notFound();
  }

  const unlocked = lesson.dayNumber <= enrollment.cohort.currentDayNumber;
  if (!unlocked) {
    notFound();
  }

  const isCompleted = lesson.isCompleted;
  const agenda = parseAgenda(lesson.agenda);
  const materials = await prisma.lessonMaterial.findMany({
    where: { learningDayId: lesson.id },
    orderBy: { addedAt: "desc" },
  });
  const baseMaterials = materials.filter((item) => !item.isTrainerFeed);
  const trainerFeed = materials
    .filter((item) => item.isTrainerFeed)
    .map((item) => ({
      id: item.id,
      title: item.title,
      type: materialKindLabel(item.kind),
      href: item.href,
      addedAt: item.addedAt.toLocaleString("ru-RU"),
    }));
  const manager = await prisma.careerManager.findFirst();

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Обучение / Урок"
          title={lesson.title}
          description={lesson.description}
        />
      </FadeIn>

      <FadeIn delay={0.08}>
        <SectionCard>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              <CalendarClock size={14} />
              Начало: {lesson.date.toLocaleDateString("ru-RU")} в {lesson.startAt}
            </span>
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-zinc-700">
              {isCompleted ? "Урок завершен" : "Урок запланирован"}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {agenda.map((topic) => (
              <div key={topic} className="rounded-2xl bg-white/80 p-4 text-sm">
                {topic}
              </div>
            ))}
          </div>
        </SectionCard>
      </FadeIn>

      {!isCompleted ? (
        <FadeIn delay={0.12}>
          <SectionCard>
            <h3 className="text-lg font-semibold">Подключение к занятию</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              В день проведения урока используйте кнопку подключения ниже.
            </p>
            <Link
              href={lesson.meetingLink}
              className={cn(buttonVariants(), "mt-4 rounded-xl")}
            >
              Подключиться <Link2 size={16} />
            </Link>
          </SectionCard>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.12}>
            <SectionCard>
              <h3 className="text-lg font-semibold">Материалы после занятия</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                После завершения урока доступны запись, презентация, PDF и дополнительные материалы.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {baseMaterials.map((material) => (
                  <Link
                    key={material.id}
                    href={material.href}
                    className="flex items-center justify-between rounded-2xl bg-white/80 p-4 text-sm transition hover:bg-white"
                  >
                    <span>{material.title}</span>
                    {material.kind === "RECORDING" ? <PlayCircle size={18} /> : <FileDown size={18} />}
                  </Link>
                ))}
                {!baseMaterials.length ? (
                  <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-muted-foreground md:col-span-2">
                    Базовые материалы пока не загружены.
                  </p>
                ) : null}
              </div>
            </SectionCard>
          </FadeIn>

          <FadeIn delay={0.15}>
            <SectionCard>
              <h3 className="text-lg font-semibold">Лента материалов от тренера</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                После урока тренер может докреплять материалы в этот день. Новые элементы появляются сверху ленты.
              </p>
              <div className="mt-5">
                <TrainerMaterialFeed items={trainerFeed} />
              </div>
            </SectionCard>
          </FadeIn>
        </>
      )}

      {lesson.dayNumber >= 5 && isCompleted && manager ? (
        <FadeIn delay={0.18}>
          <CareerManagerCard manager={manager} />
        </FadeIn>
      ) : null}
    </div>
  );
}
