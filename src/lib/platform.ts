import { CohortStatus, MaterialKind, UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function parseAgenda(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String);
    return [];
  } catch {
    return [];
  }
}

export function materialKindLabel(kind: MaterialKind): "recording" | "presentation" | "pdf" | "extra" {
  switch (kind) {
    case MaterialKind.RECORDING:
      return "recording";
    case MaterialKind.PRESENTATION:
      return "presentation";
    case MaterialKind.PDF:
      return "pdf";
    default:
      return "extra";
  }
}

export async function getClientEnrollment(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      cohort: {
        include: {
          days: {
            include: {
              materials: {
                orderBy: { addedAt: "desc" },
              },
              scheduleItems: {
                orderBy: [{ sortOrder: "asc" }, { startAt: "asc" }],
              },
            },
            orderBy: { dayNumber: "asc" },
          },
        },
      },
    },
  });

  const current = enrollments.find((item) => item.cohort.status === CohortStatus.CURRENT);
  if (current) return current;
  return enrollments.find((item) => item.cohort.status === CohortStatus.RECRUITING) ?? enrollments[0] ?? null;
}

export async function getClientCurrentDay(userId: string) {
  const enrollment = await getClientEnrollment(userId);
  if (!enrollment) return null;
  const dayNumber = enrollment.cohort.currentDayNumber;
  return enrollment.cohort.days.find((day) => day.dayNumber === dayNumber) ?? null;
}

export async function getClientDays(userId: string) {
  const enrollment = await getClientEnrollment(userId);
  if (!enrollment) return [];
  return enrollment.cohort.days.map((day) => ({
    ...day,
    isCurrent: day.dayNumber === enrollment.cohort.currentDayNumber,
    isUnlocked: day.dayNumber <= enrollment.cohort.currentDayNumber,
  }));
}

export async function getCurrentScheduleForUser(userId: string) {
  const enrollment = await getClientEnrollment(userId);
  if (!enrollment) return null;
  return enrollment.cohort.days.find((day) => day.dayNumber === enrollment.cohort.currentDayNumber) ?? null;
}

export async function getLatestNewsForUser(userId: string, limit = 10) {
  const enrollment = await getClientEnrollment(userId);
  if (!enrollment) return [];
  return prisma.news.findMany({
    where: { cohortId: enrollment.cohort.id },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAdminData() {
  const [users, cohorts, news, libraryItems, documents, manager] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.CLIENT },
      orderBy: { createdAt: "desc" },
      include: {
        enrollments: {
          include: {
            cohort: true,
          },
        },
      },
    }),
    prisma.cohort.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        days: {
          include: {
            materials: true,
            scheduleItems: {
              orderBy: [{ sortOrder: "asc" }, { startAt: "asc" }],
            },
          },
          orderBy: { dayNumber: "asc" },
        },
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    }),
    prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
      include: { cohort: true },
    }),
    prisma.libraryItem.findMany({
      orderBy: { updatedAt: "desc" },
    }),
    prisma.employmentDocument.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: true },
    }),
    prisma.careerManager.findFirst(),
  ]);

  return { users, cohorts, news, libraryItems, documents, manager };
}
