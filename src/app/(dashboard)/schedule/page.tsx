import { CalendarRange, Clock3 } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { StatusPill } from "@/components/common/status-pill";
import { requireUser } from "@/lib/auth";
import { getClientEnrollment, getCurrentScheduleForUser } from "@/lib/platform";

export default async function SchedulePage() {
  const user = await requireUser();
  const [enrollment, currentSchedule] = await Promise.all([
    getClientEnrollment(user.id),
    getCurrentScheduleForUser(user.id),
  ]);

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Расписание"
          title="Календарь занятий"
          description={
            enrollment
              ? `Расписание вашего потока: ${enrollment.cohort.name}.`
              : "Ближайшие и прошедшие занятия с датой, временем и статусом."
          }
        />
      </FadeIn>

      <FadeIn delay={0.04}>
        <SectionCard>
          {currentSchedule ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <StatusPill status={currentSchedule.isCompleted ? "finished" : "online"} />
              </div>
              <h3 className="text-lg font-semibold">{currentSchedule.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                  <CalendarRange size={14} />
                  {currentSchedule.date.toLocaleDateString("ru-RU")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                  <Clock3 size={14} />
                  {currentSchedule.startAt}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {currentSchedule.scheduleItems?.map((item) => (
                  <div key={item.id} className="rounded-xl bg-white/80 px-3 py-2 text-sm">
                    <p className="font-medium">{item.startAt} - {item.endAt}</p>
                    <p className="text-muted-foreground">{item.title} • {item.format}</p>
                  </div>
                ))}
                {!currentSchedule.scheduleItems?.length ? (
                  <p className="rounded-xl bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                    Детальное расписание текущего дня пока не добавлено.
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              На текущий день расписание пока не назначено.
            </p>
          )}
        </SectionCard>
      </FadeIn>
    </div>
  );
}
