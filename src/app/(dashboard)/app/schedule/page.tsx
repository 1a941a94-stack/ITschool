import { CalendarRange, Clock3 } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { StatusPill } from "@/components/common/status-pill";
import { requireUser } from "@/lib/auth";
import { getClientEnrollment, getUnlockedScheduleForUser } from "@/lib/platform";

export default async function SchedulePage() {
  const user = await requireUser();
  const [enrollment, scheduleDays] = await Promise.all([
    getClientEnrollment(user.id),
    getUnlockedScheduleForUser(user.id),
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

      {!scheduleDays.length ? (
        <FadeIn delay={0.04}>
          <SectionCard>
            <p className="text-sm text-muted-foreground">
              На текущий день расписание пока не назначено.
            </p>
          </SectionCard>
        </FadeIn>
      ) : null}

      {scheduleDays.map((day, index) => (
        <FadeIn key={day.id} delay={0.04 * (index + 1)}>
          <SectionCard>
            <div className="mb-3 flex items-center justify-between gap-3">
              <StatusPill status={day.isCompleted ? "finished" : day.isCurrent ? "online" : "finished"} />
              {day.isCurrent ? (
                <span className="text-xs font-medium text-blue-700">Текущий день</span>
              ) : null}
            </div>
            <h3 className="text-lg font-semibold">
              День {day.dayNumber} • {day.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <CalendarRange size={14} />
                {day.date.toLocaleDateString("ru-RU")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <Clock3 size={14} />
                {day.startAt}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {day.scheduleItems?.map((item) => (
                <div key={item.id} className="rounded-xl bg-white/80 px-3 py-2 text-sm">
                  <p className="font-medium">
                    {item.startAt} - {item.endAt}
                  </p>
                  <p className="text-muted-foreground">
                    {item.title} • {item.format}
                  </p>
                </div>
              ))}
              {!day.scheduleItems?.length ? (
                <p className="rounded-xl bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                  Детальное расписание дня пока не добавлено.
                </p>
              ) : null}
            </div>
          </SectionCard>
        </FadeIn>
      ))}
    </div>
  );
}
