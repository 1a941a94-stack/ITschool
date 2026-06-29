import { CohortStatus, MaterialKind, Prisma, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { AdminConfirmDeleteForm, AdminConfirmForm } from "@/components/admin/admin-confirm-delete-form";
import { AdminCreateCohortFields } from "@/components/admin/admin-create-cohort-fields";
import { AdminField } from "@/components/admin/admin-field";
import { AdminLearningDayFields } from "@/components/admin/admin-learning-day-fields";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/auth";
import { formatDefaultCohortDescription, formatDefaultCohortName, buildDefaultCohortDays } from "@/lib/cohort";
import { getAdminData } from "@/lib/platform";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});
const updateUserSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().optional(),
});
const enrollmentSchema = z.object({
  userId: z.string().min(1),
  cohortId: z.string().min(1),
});
const newsSchema = z.object({
  id: z.string().optional(),
  cohortId: z.string().min(1),
  title: z.string().min(4),
  description: z.string().min(8),
});
const cohortSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  description: z.string().min(6),
  status: z.enum(["RECRUITING", "CURRENT", "COMPLETED"]),
  currentDayNumber: z.coerce.number().int().min(1).max(30),
});
const daySchema = z.object({
  id: z.string().optional(),
  cohortId: z.string().min(1),
  dayNumber: z.coerce.number().int().min(1).max(30),
  slug: z.string().min(3),
  title: z.string().min(3),
  date: z.string().min(8),
  startAt: z.string().min(3),
  description: z.string().min(8),
  meetingLink: z.string().min(1),
  agenda: z.string().min(2),
  isCompleted: z.enum(["true", "false"]),
});
const materialSchema = z.object({
  id: z.string().optional(),
  learningDayId: z.string().min(1),
  title: z.string().min(3),
  href: z.string().min(1),
  kind: z.enum(["RECORDING", "PRESENTATION", "PDF", "EXTRA"]),
  isTrainerFeed: z.enum(["true", "false"]),
});
const scheduleItemSchema = z.object({
  id: z.string().optional(),
  learningDayId: z.string().min(1),
  startAt: z.string().min(3),
  endAt: z.string().min(3),
  title: z.string().min(3),
  format: z.string().min(3),
  sortOrder: z.coerce.number().int().min(0).max(100).optional(),
});
const librarySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  category: z.string().min(2),
  type: z.string().min(2),
  href: z.string().min(1),
});
const documentSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(3),
  previewHref: z.string().min(1),
  downloadHref: z.string().min(1),
});
const managerSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  about: z.string().min(6),
  photo: z.string().min(1),
  telegramTag: z.string().min(2),
  maxTag: z.string().min(2),
});

function revalidateAllPaths() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/learning");
  revalidatePath("/schedule");
  revalidatePath("/library");
  revalidatePath("/documents");
}

type SearchParams = Promise<{ tab?: string; userCreated?: string; userError?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const { users, cohorts, news, libraryItems, documents, manager } = await getAdminData();
  const params = await searchParams;
  const tab = params.tab ?? "home";
  const userCreated = params.userCreated === "1";
  const userError = params.userError;
  const allDays = cohorts.flatMap((cohort) => cohort.days.map((day) => ({ cohortName: cohort.name, day })));
  const defaultCohortName = formatDefaultCohortName();
  const defaultCohortDescription = formatDefaultCohortDescription();

  async function createClientAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = createUserSchema.safeParse({
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      phone: String(formData.get("phone") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
    if (!parsed.success) {
      redirect("/admin?tab=users&userError=validation");
    }
    const passwordHash = await hash(parsed.data.password, 10);
    try {
      await prisma.user.create({
        data: {
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          role: UserRole.CLIENT,
          passwordHash,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        redirect("/admin?tab=users&userError=email");
      }
      throw error;
    }
    revalidateAllPaths();
    redirect("/admin?tab=users&userCreated=1");
  }

  async function updateClientAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = updateUserSchema.safeParse({
      id: String(formData.get("id") ?? ""),
      fullName: String(formData.get("fullName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    });
    if (!parsed.success) return;
    await prisma.user.update({
      where: { id: parsed.data.id },
      data: { fullName: parsed.data.fullName, phone: parsed.data.phone || null },
    });
    revalidatePath("/admin");
  }

  async function enrollClientAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = enrollmentSchema.safeParse({
      userId: String(formData.get("userId") ?? ""),
      cohortId: String(formData.get("cohortId") ?? ""),
    });
    if (!parsed.success) return;
    await prisma.enrollment.upsert({
      where: { userId_cohortId: parsed.data },
      update: {},
      create: parsed.data,
    });
    revalidateAllPaths();
  }

  async function unenrollClientAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = enrollmentSchema.safeParse({
      userId: String(formData.get("userId") ?? ""),
      cohortId: String(formData.get("cohortId") ?? ""),
    });
    if (!parsed.success) return;
    await prisma.enrollment.deleteMany({
      where: {
        userId: parsed.data.userId,
        cohortId: parsed.data.cohortId,
      },
    });
    revalidateAllPaths();
  }

  async function upsertNewsAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = newsSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      cohortId: String(formData.get("cohortId") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
    });
    if (!parsed.success) return;
    const payload = {
      cohortId: parsed.data.cohortId,
      title: parsed.data.title,
      description: parsed.data.description,
    };
    if (parsed.data.id) {
      await prisma.news.update({ where: { id: parsed.data.id }, data: payload });
    } else {
      await prisma.news.create({ data: payload });
    }
    revalidateAllPaths();
  }

  async function deleteNewsAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.news.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function deleteCohortAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.cohort.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function deleteScheduleItemAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.dayScheduleItem.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function deleteLibraryItemAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.libraryItem.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function deleteDocumentAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.employmentDocument.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function deleteClientAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== UserRole.CLIENT) return;
    await prisma.user.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function upsertCohortAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = cohortSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      name: String(formData.get("name") ?? "").trim() || formatDefaultCohortName(),
      description: String(formData.get("description") ?? "").trim() || formatDefaultCohortDescription(),
      status: String(formData.get("status") ?? "RECRUITING"),
      currentDayNumber: String(formData.get("currentDayNumber") ?? "1"),
    });
    if (!parsed.success) return;
    if (parsed.data.status === "CURRENT") {
      await prisma.cohort.updateMany({
        where: { status: CohortStatus.CURRENT, id: { not: parsed.data.id } },
        data: { status: CohortStatus.COMPLETED },
      });
    }
    if (parsed.data.id) {
      await prisma.cohort.update({
        where: { id: parsed.data.id },
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          status: parsed.data.status as CohortStatus,
          currentDayNumber: parsed.data.currentDayNumber,
        },
      });
    } else {
      await prisma.cohort.create({
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          status: parsed.data.status as CohortStatus,
          currentDayNumber: parsed.data.currentDayNumber,
          days: {
            create: buildDefaultCohortDays(),
          },
        },
      });
    }
    revalidateAllPaths();
  }

  async function upsertDayAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = daySchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      cohortId: String(formData.get("cohortId") ?? ""),
      dayNumber: String(formData.get("dayNumber") ?? "1"),
      slug: String(formData.get("slug") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim(),
      startAt: String(formData.get("startAt") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      meetingLink: String(formData.get("meetingLink") ?? "").trim() || "#",
      agenda: String(formData.get("agenda") ?? "").trim(),
      isCompleted: String(formData.get("isCompleted") ?? "false"),
    });
    if (!parsed.success) return;
    const data = {
      cohortId: parsed.data.cohortId,
      dayNumber: parsed.data.dayNumber,
      slug: parsed.data.slug,
      title: parsed.data.title,
      date: new Date(parsed.data.date),
      startAt: parsed.data.startAt,
      description: parsed.data.description,
      meetingLink: parsed.data.meetingLink,
      agenda: parsed.data.agenda,
      isCompleted: parsed.data.isCompleted === "true",
    };
    if (parsed.data.id) await prisma.learningDay.update({ where: { id: parsed.data.id }, data });
    else await prisma.learningDay.create({ data });
    revalidateAllPaths();
  }

  async function upsertMaterialAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = materialSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      learningDayId: String(formData.get("learningDayId") ?? ""),
      title: String(formData.get("title") ?? "").trim(),
      href: String(formData.get("href") ?? "#").trim() || "#",
      kind: String(formData.get("kind") ?? "EXTRA"),
      isTrainerFeed: String(formData.get("isTrainerFeed") ?? "false"),
    });
    if (!parsed.success) return;
    const payload = {
      learningDayId: parsed.data.learningDayId,
      title: parsed.data.title,
      href: parsed.data.href,
      kind: parsed.data.kind as MaterialKind,
      isTrainerFeed: parsed.data.isTrainerFeed === "true",
    };
    if (parsed.data.id) await prisma.lessonMaterial.update({ where: { id: parsed.data.id }, data: payload });
    else await prisma.lessonMaterial.create({ data: payload });
    revalidateAllPaths();
  }

  async function deleteMaterialAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.lessonMaterial.delete({ where: { id } });
    revalidateAllPaths();
  }

  async function upsertScheduleItemAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = scheduleItemSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      learningDayId: String(formData.get("learningDayId") ?? ""),
      startAt: String(formData.get("startAt") ?? "").trim(),
      endAt: String(formData.get("endAt") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      format: String(formData.get("format") ?? "").trim(),
      sortOrder: String(formData.get("sortOrder") ?? "0"),
    });
    if (!parsed.success) return;
    const payload = {
      learningDayId: parsed.data.learningDayId,
      startAt: parsed.data.startAt,
      endAt: parsed.data.endAt,
      title: parsed.data.title,
      format: parsed.data.format,
      sortOrder: parsed.data.sortOrder ?? 0,
    };
    if (parsed.data.id) await prisma.dayScheduleItem.update({ where: { id: parsed.data.id }, data: payload });
    else await prisma.dayScheduleItem.create({ data: payload });
    revalidateAllPaths();
  }

  async function upsertLibraryAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = librarySchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      title: String(formData.get("title") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      type: String(formData.get("type") ?? "").trim(),
      href: String(formData.get("href") ?? "#").trim() || "#",
    });
    if (!parsed.success) return;
    const payload = {
      title: parsed.data.title,
      category: parsed.data.category,
      type: parsed.data.type,
      href: parsed.data.href,
    };
    if (parsed.data.id) await prisma.libraryItem.update({ where: { id: parsed.data.id }, data: payload });
    else await prisma.libraryItem.create({ data: payload });
    revalidateAllPaths();
  }

  async function upsertDocumentAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = documentSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      userId: String(formData.get("userId") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      previewHref: String(formData.get("previewHref") ?? "").trim() || "#",
      downloadHref: String(formData.get("downloadHref") ?? "").trim() || "#",
    });
    if (!parsed.success) return;
    if (parsed.data.id) {
      await prisma.employmentDocument.update({
        where: { id: parsed.data.id },
        data: {
          userId: parsed.data.userId,
          title: parsed.data.title,
          description: parsed.data.description,
          previewHref: parsed.data.previewHref,
          downloadHref: parsed.data.downloadHref,
        },
      });
    } else {
      await prisma.employmentDocument.create({
        data: {
          userId: parsed.data.userId,
          title: parsed.data.title,
          description: parsed.data.description,
          previewHref: parsed.data.previewHref,
          downloadHref: parsed.data.downloadHref,
        },
      });
    }
    revalidateAllPaths();
  }

  async function updateManagerAction(formData: FormData) {
    "use server";
    await requireAdmin();
    const parsed = managerSchema.safeParse({
      name: String(formData.get("name") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      about: String(formData.get("about") ?? "").trim(),
      photo: String(formData.get("photo") ?? "").trim() || "/career-manager.svg",
      telegramTag: String(formData.get("telegramTag") ?? "").trim(),
      maxTag: String(formData.get("maxTag") ?? "").trim(),
    });
    if (!parsed.success) return;
    const existing = await prisma.careerManager.findFirst();
    if (existing) await prisma.careerManager.update({ where: { id: existing.id }, data: parsed.data });
    else await prisma.careerManager.create({ data: parsed.data });
    revalidateAllPaths();
  }

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Admin"
          title="Настройки раздела"
          description="Каждый пункт меню слева открывает отдельный экран с собственными настройками."
        />
      </FadeIn>

      {tab === "home" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Главная админ-панели</h3>
          <p className="text-sm text-muted-foreground">Пользователей: {users.length} • Потоков: {cohorts.length} • Новостей: {news.length}</p>
          <p className="text-sm text-muted-foreground">Выберите раздел в левом меню для детальной настройки.</p>
        </SectionCard>
      )}

      {tab === "users" && (
        <div className="grid gap-5 xl:grid-cols-2">
          {userCreated ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 xl:col-span-2">
              Пользователь создан. Назначьте его в поток, чтобы открылся доступ к обучению.
            </p>
          ) : null}
          {userError === "validation" ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 xl:col-span-2">
              Не удалось создать пользователя. Проверьте ФИО, email и пароль (минимум 8 символов).
            </p>
          ) : null}
          {userError === "email" ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 xl:col-span-2">
              Пользователь с таким email уже существует.
            </p>
          ) : null}
          <SectionCard className="space-y-3">
            <h3 className="text-lg font-semibold">Создать пользователя</h3>
            <form action={createClientAction} className="grid gap-2">
              <Input name="fullName" placeholder="ФИО" className="h-11 rounded-xl bg-white/80" required />
              <Input name="email" type="email" placeholder="Email" className="h-11 rounded-xl bg-white/80" required />
              <Input name="phone" placeholder="Телефон" className="h-11 rounded-xl bg-white/80" />
              <Input name="password" type="password" placeholder="Пароль (минимум 8 символов)" minLength={8} className="h-11 rounded-xl bg-white/80" required />
              <button type="submit" className={cn(buttonVariants(), "h-11 rounded-xl")}>Создать</button>
            </form>
          </SectionCard>
          <SectionCard className="space-y-3">
            <h3 className="text-lg font-semibold">Назначить в поток</h3>
            <form action={enrollClientAction} className="grid gap-2">
              <select name="userId" className="h-11 rounded-xl border border-input bg-white/80 px-3 text-sm" required>
                <option value="">Клиент</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
              </select>
              <select name="cohortId" className="h-11 rounded-xl border border-input bg-white/80 px-3 text-sm" required>
                <option value="">Поток</option>
                {cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}
              </select>
              <button type="submit" className={cn(buttonVariants(), "h-11 rounded-xl")}>Назначить</button>
            </form>
          </SectionCard>
          <SectionCard className="space-y-3">
            <h3 className="text-lg font-semibold">Удалить из потока</h3>
            <AdminConfirmForm
              action={unenrollClientAction}
              confirmMessage="Удалить участника из выбранного потока?"
              className="grid gap-2"
            >
              <select name="userId" className="h-11 rounded-xl border border-input bg-white/80 px-3 text-sm" required>
                <option value="">Клиент</option>
                {users
                  .filter((user) => user.enrollments.length > 0)
                  .map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
              </select>
              <select name="cohortId" className="h-11 rounded-xl border border-input bg-white/80 px-3 text-sm" required>
                <option value="">Поток</option>
                {cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}
              </select>
              <button type="submit" className={cn(buttonVariants({ variant: "destructive" }), "h-11 rounded-xl")}>
                Удалить из потока
              </button>
            </AdminConfirmForm>
          </SectionCard>
          <SectionCard className="xl:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">Редактирование пользователей</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {users.map((user) => (
                <div key={user.id} className="rounded-xl bg-white/80 p-3">
                  <form action={updateClientAction}>
                    <input type="hidden" name="id" value={user.id} />
                    <Input name="fullName" defaultValue={user.fullName} className="mb-2 h-9 rounded-lg" />
                    <Input name="phone" defaultValue={user.phone ?? ""} className="mb-2 h-9 rounded-lg" />
                    <p className="mb-2 text-xs text-muted-foreground">{user.email}</p>
                    {user.enrollments.length ? (
                      <div className="mb-2 space-y-1">
                        {user.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-1">
                            <span className="text-xs text-green-700">{enrollment.cohort.name}</span>
                            <AdminConfirmDeleteForm
                              action={unenrollClientAction}
                              confirmMessage={`Убрать «${user.fullName}» из потока «${enrollment.cohort.name}»?`}
                              hiddenFields={{ userId: user.id, cohortId: enrollment.cohortId }}
                            >
                              <button
                                type="submit"
                                className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "h-7 rounded-md px-2 text-xs")}
                              >
                                Убрать
                              </button>
                            </AdminConfirmDeleteForm>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-2 text-xs text-amber-700">Не назначен в поток</p>
                    )}
                    <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>Сохранить</button>
                  </form>
                  <AdminConfirmDeleteForm
                    action={deleteClientAction}
                    confirmMessage={`Удалить пользователя «${user.fullName}»? Это действие нельзя отменить.`}
                    hiddenFields={{ id: user.id }}
                    className="mt-2"
                  >
                    <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                      Удалить пользователя
                    </button>
                  </AdminConfirmDeleteForm>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "flows" && (
        <SectionCard className="space-y-4">
          <h3 className="text-lg font-semibold">Потоки</h3>
          <form action={upsertCohortAction} className="grid gap-2 md:grid-cols-2">
            <Input name="name" defaultValue={defaultCohortName} placeholder="Название потока" className="h-10 rounded-lg" required />
            <Input name="description" defaultValue={defaultCohortDescription} placeholder="Описание" className="h-10 rounded-lg" required />
            <select name="status" className="h-10 rounded-lg border border-input bg-white px-3 text-sm">
              <option value="RECRUITING">Набор</option>
              <option value="CURRENT">Текущий</option>
              <option value="COMPLETED">Завершен</option>
            </select>
            <Input name="currentDayNumber" type="number" defaultValue={1} className="h-10 rounded-lg" />
            <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-2")}>Создать поток</button>
          </form>
          <div className="space-y-2">
            {cohorts.map((cohort) => (
              <div key={cohort.id} className="rounded-xl bg-white/80 p-3">
                <form action={upsertCohortAction}>
                  <input type="hidden" name="id" value={cohort.id} />
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input name="name" defaultValue={cohort.name} className="h-9 rounded-lg" />
                    <Input name="description" defaultValue={cohort.description} className="h-9 rounded-lg" />
                    <select name="status" defaultValue={cohort.status} className="h-9 rounded-lg border border-input bg-white px-3 text-sm">
                      <option value="RECRUITING">Набор</option><option value="CURRENT">Текущий</option><option value="COMPLETED">Завершен</option>
                    </select>
                    <Input name="currentDayNumber" type="number" defaultValue={cohort.currentDayNumber} className="h-9 rounded-lg" />
                    <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-2")}>Сохранить поток</button>
                  </div>
                </form>
                <AdminConfirmDeleteForm
                  action={deleteCohortAction}
                  confirmMessage={`Удалить поток «${cohort.name}» со всеми днями, новостями и участниками?`}
                  hiddenFields={{ id: cohort.id }}
                  className="mt-2"
                >
                  <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                    Удалить поток
                  </button>
                </AdminConfirmDeleteForm>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "learning" && (
        <SectionCard className="space-y-4">
          <h3 className="text-lg font-semibold">Дни обучения</h3>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="mb-3 text-sm font-semibold">Создать новый поток</h4>
            <form action={upsertCohortAction} className="grid gap-3 md:grid-cols-2">
              <AdminCreateCohortFields />
              <div className="md:col-span-2">
                <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                  Создать поток
                </button>
              </div>
            </form>
          </div>

          {cohorts.map((cohort) => (
            <details key={cohort.id} className="rounded-xl bg-white/80 p-3" open={cohort.status === "CURRENT"}>
              <summary className="cursor-pointer text-sm font-semibold">{cohort.name}</summary>
              <AdminConfirmDeleteForm
                action={deleteCohortAction}
                confirmMessage={`Удалить поток «${cohort.name}» со всеми днями, новостями и участниками?`}
                hiddenFields={{ id: cohort.id }}
                className="mt-2"
              >
                <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                  Удалить поток
                </button>
              </AdminConfirmDeleteForm>
              <div className="mt-3 space-y-2">
                {cohort.days.map((day) => (
                  <form key={day.id} action={upsertDayAction} className="rounded-lg bg-white p-2">
                    <input type="hidden" name="id" value={day.id} />
                    <input type="hidden" name="cohortId" value={cohort.id} />
                    <div className="grid gap-2 md:grid-cols-3">
                      <AdminLearningDayFields
                        values={{
                          dayNumber: day.dayNumber,
                          slug: day.slug,
                          title: day.title,
                          date: day.date.toISOString().slice(0, 10),
                          startAt: day.startAt,
                          meetingLink: day.meetingLink,
                          description: day.description,
                          agenda: day.agenda,
                          isCompleted: day.isCompleted,
                        }}
                      />
                      <div className="flex items-end">
                        <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                          Сохранить
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
                <form action={upsertDayAction} className="grid gap-2 rounded-lg bg-white p-2 md:grid-cols-3">
                  <input type="hidden" name="cohortId" value={cohort.id} />
                  <AdminLearningDayFields />
                  <div className="flex items-end">
                    <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                      Добавить день
                    </button>
                  </div>
                </form>
              </div>
            </details>
          ))}
        </SectionCard>
      )}

      {tab === "schedule" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Настройки расписания</h3>
          <p className="text-sm text-muted-foreground">
            Разверните поток и настройте блоки текущего дня. Участники видят расписание только своего потока.
          </p>
          <div className="space-y-2">
            {cohorts.map((cohort) => {
              const day = cohort.days.find((item) => item.dayNumber === cohort.currentDayNumber);
              return (
                <details key={cohort.id} className="rounded-xl bg-white/80 p-3 text-sm" open={cohort.status === "CURRENT"}>
                  <summary className="cursor-pointer font-semibold">{cohort.name}</summary>
                  {day ? (
                    <div className="mt-3">
                      <p className="text-muted-foreground">
                        Текущий день: {day.dayNumber} • {day.title}
                      </p>
                      <form action={upsertScheduleItemAction} className="mt-3 grid gap-2 md:grid-cols-3">
                        <input type="hidden" name="learningDayId" value={day.id} />
                        <Input name="startAt" placeholder="Начало (10:00)" className="h-9 rounded-lg" required />
                        <Input name="endAt" placeholder="Окончание (12:00)" className="h-9 rounded-lg" required />
                        <Input name="title" placeholder="Активность (видеовстреча)" className="h-9 rounded-lg" required />
                        <Input name="format" placeholder="Формат (онлайн/самостоятельно)" className="h-9 rounded-lg md:col-span-2" required />
                        <Input name="sortOrder" type="number" defaultValue={0} className="h-9 rounded-lg" />
                        <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-3")}>
                          Добавить слот текущего дня
                        </button>
                      </form>
                      <div className="mt-3 space-y-2">
                        {day.scheduleItems.map((slot) => (
                          <div key={slot.id} className="rounded-lg bg-white p-2">
                            <form action={upsertScheduleItemAction}>
                              <input type="hidden" name="id" value={slot.id} />
                              <input type="hidden" name="learningDayId" value={day.id} />
                              <div className="grid gap-2 md:grid-cols-3">
                                <Input name="startAt" defaultValue={slot.startAt} className="h-9 rounded-lg" />
                                <Input name="endAt" defaultValue={slot.endAt} className="h-9 rounded-lg" />
                                <Input name="title" defaultValue={slot.title} className="h-9 rounded-lg" />
                                <Input name="format" defaultValue={slot.format} className="h-9 rounded-lg md:col-span-2" />
                                <Input name="sortOrder" type="number" defaultValue={slot.sortOrder} className="h-9 rounded-lg" />
                                <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-3")}>
                                  Сохранить слот
                                </button>
                              </div>
                            </form>
                            <AdminConfirmDeleteForm
                              action={deleteScheduleItemAction}
                              confirmMessage={`Удалить слот «${slot.title}»?`}
                              hiddenFields={{ id: slot.id }}
                              className="mt-2"
                            >
                              <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                                Удалить слот
                              </button>
                            </AdminConfirmDeleteForm>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-muted-foreground">
                      Нет дня №{cohort.currentDayNumber}. Добавьте его в разделе Обучение.
                    </p>
                  )}
                </details>
              );
            })}
            {!cohorts.length ? (
              <p className="rounded-xl bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                Сначала создайте поток в разделе Обучение.
              </p>
            ) : null}
          </div>
        </SectionCard>
      )}

      {tab === "news" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Новости</h3>
          <p className="text-sm text-muted-foreground">
            Новости привязаны к потоку. Участники видят только ленту своего потока.
          </p>
          <div className="space-y-2">
            {cohorts.map((cohort) => {
              const cohortNews = news.filter((item) => item.cohortId === cohort.id);
              return (
                <details key={cohort.id} className="rounded-xl bg-white/80 p-3" open={cohort.status === "CURRENT"}>
                  <summary className="cursor-pointer text-sm font-semibold">{cohort.name}</summary>
                  <div className="mt-3 space-y-3">
                    <form action={upsertNewsAction} className="grid gap-2">
                      <input type="hidden" name="cohortId" value={cohort.id} />
                      <Input name="title" placeholder="Заголовок" className="h-10 rounded-lg" required />
                      <Input name="description" placeholder="Описание" className="h-10 rounded-lg" required />
                      <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                        Добавить новость в поток
                      </button>
                    </form>
                    {cohortNews.map((item) => (
                      <div key={item.id} className="rounded-lg bg-white p-3">
                        <form action={upsertNewsAction} className="grid gap-2">
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="cohortId" value={cohort.id} />
                          <Input name="title" defaultValue={item.title} className="h-9 rounded-lg" />
                          <Input name="description" defaultValue={item.description} className="h-9 rounded-lg" />
                          <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                            Сохранить
                          </button>
                        </form>
                        <AdminConfirmDeleteForm
                          action={deleteNewsAction}
                          confirmMessage={`Удалить новость «${item.title}»?`}
                          hiddenFields={{ id: item.id }}
                          className="mt-2"
                        >
                          <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                            Удалить
                          </button>
                        </AdminConfirmDeleteForm>
                      </div>
                    ))}
                    {!cohortNews.length ? (
                      <p className="text-sm text-muted-foreground">Новостей для этого потока пока нет.</p>
                    ) : null}
                  </div>
                </details>
              );
            })}
          </div>
        </SectionCard>
      )}

      {tab === "materials" && (
        <SectionCard className="space-y-4">
          <h3 className="text-lg font-semibold">Материалы дней</h3>
          <p className="text-sm text-muted-foreground">
            Прикреплённые материалы к урокам: записи, презентации, PDF и дополнительные файлы.
          </p>

          <form action={upsertMaterialAction} className="grid gap-3 md:grid-cols-2">
            <AdminField label="День" className="md:col-span-2">
              <select name="learningDayId" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" required>
                <option value="">Выберите день</option>
                {allDays.map(({ cohortName, day }) => (
                  <option key={day.id} value={day.id}>
                    {cohortName} • День {day.dayNumber}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Название">
              <Input name="title" className="h-10 rounded-lg" required />
            </AdminField>
            <AdminField label="Ссылка">
              <Input name="href" className="h-10 rounded-lg" required />
            </AdminField>
            <AdminField label="Тип">
              <select name="kind" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                <option value="RECORDING">Запись</option>
                <option value="PRESENTATION">Презентация</option>
                <option value="PDF">PDF</option>
                <option value="EXTRA">Дополнительный</option>
              </select>
            </AdminField>
            <AdminField label="Размещение">
              <select name="isTrainerFeed" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                <option value="true">В ленту тренера</option>
                <option value="false">В основные материалы</option>
              </select>
            </AdminField>
            <div className="md:col-span-2">
              <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                Добавить материал
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {cohorts.map((cohort) => {
              const cohortMaterials = cohort.days.flatMap((day) =>
                day.materials.map((material) => ({ day, material })),
              );
              if (!cohortMaterials.length) return null;

              return (
                <details key={cohort.id} className="rounded-xl bg-white/80 p-3" open={cohort.status === "CURRENT"}>
                  <summary className="cursor-pointer text-sm font-semibold">
                    {cohort.name} • {cohortMaterials.length} материал(ов)
                  </summary>
                  <div className="mt-3 space-y-3">
                    {cohortMaterials.map(({ day, material }) => (
                      <div key={material.id} className="rounded-lg bg-white p-3">
                        <p className="mb-3 text-xs text-muted-foreground">
                          День {day.dayNumber} • {day.title}
                        </p>
                        <form action={upsertMaterialAction}>
                          <input type="hidden" name="id" value={material.id} />
                          <div className="grid gap-3 md:grid-cols-2">
                            <AdminField label="День" className="md:col-span-2">
                              <select
                                name="learningDayId"
                                defaultValue={day.id}
                                className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                required
                              >
                                {allDays.map(({ cohortName, day: optionDay }) => (
                                  <option key={optionDay.id} value={optionDay.id}>
                                    {cohortName} • День {optionDay.dayNumber}
                                  </option>
                                ))}
                              </select>
                            </AdminField>
                            <AdminField label="Название">
                              <Input name="title" defaultValue={material.title} className="h-9 rounded-lg" required />
                            </AdminField>
                            <AdminField label="Ссылка">
                              <Input name="href" defaultValue={material.href} className="h-9 rounded-lg" required />
                            </AdminField>
                            <AdminField label="Тип">
                              <select
                                name="kind"
                                defaultValue={material.kind}
                                className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm"
                              >
                                <option value="RECORDING">Запись</option>
                                <option value="PRESENTATION">Презентация</option>
                                <option value="PDF">PDF</option>
                                <option value="EXTRA">Дополнительный</option>
                              </select>
                            </AdminField>
                            <AdminField label="Размещение">
                              <select
                                name="isTrainerFeed"
                                defaultValue={String(material.isTrainerFeed)}
                                className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm"
                              >
                                <option value="true">В ленту тренера</option>
                                <option value="false">В основные материалы</option>
                              </select>
                            </AdminField>
                            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                              <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                                Сохранить
                              </button>
                              <a
                                href={material.href}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "rounded-lg")}
                              >
                                Открыть
                              </a>
                            </div>
                          </div>
                        </form>
                        <AdminConfirmDeleteForm
                          action={deleteMaterialAction}
                          confirmMessage={`Удалить материал «${material.title}»?`}
                          hiddenFields={{ id: material.id }}
                          className="mt-2"
                        >
                          <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                            Удалить материал
                          </button>
                        </AdminConfirmDeleteForm>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
            {!cohorts.some((cohort) => cohort.days.some((day) => day.materials.length > 0)) ? (
              <p className="rounded-xl bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                Прикреплённых материалов пока нет.
              </p>
            ) : null}
          </div>
        </SectionCard>
      )}

      {tab === "library" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Библиотека</h3>
          <p className="text-sm text-muted-foreground">У каждого материала обязательно указывайте ссылку, куда он загружен.</p>
          <form action={upsertLibraryAction} className="grid gap-2 md:grid-cols-4">
            <Input name="title" placeholder="Название" className="h-10 rounded-lg" required />
            <Input name="category" placeholder="Категория" className="h-10 rounded-lg" required />
            <Input name="type" placeholder="Тип" className="h-10 rounded-lg" required />
            <Input name="href" placeholder="Ссылка на материал" className="h-10 rounded-lg" required />
            <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-4")}>Добавить</button>
          </form>
          <div className="space-y-2">
            {libraryItems.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/80 p-3">
                <form action={upsertLibraryAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid gap-2 md:grid-cols-4">
                    <Input name="title" defaultValue={item.title} className="h-9 rounded-lg" />
                    <Input name="category" defaultValue={item.category} className="h-9 rounded-lg" />
                    <Input name="type" defaultValue={item.type} className="h-9 rounded-lg" />
                    <Input name="href" defaultValue={item.href} className="h-9 rounded-lg" />
                    <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg md:col-span-4")}>Сохранить</button>
                  </div>
                </form>
                <AdminConfirmDeleteForm
                  action={deleteLibraryItemAction}
                  confirmMessage={`Удалить «${item.title}» из библиотеки?`}
                  hiddenFields={{ id: item.id }}
                  className="mt-2"
                >
                  <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                    Удалить из библиотеки
                  </button>
                </AdminConfirmDeleteForm>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "documents" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Документы и карьерный менеджер</h3>
          <p className="text-sm text-muted-foreground">
            Документы прикрепляются к конкретному ученику и видны только ему.
          </p>
          <form action={upsertDocumentAction} className="grid gap-3 md:grid-cols-2">
            <AdminField label="Ученик" className="md:col-span-2">
              <select name="userId" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" required>
                <option value="">Выберите ученика</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} ({user.email})
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Название документа">
              <Input name="title" className="h-10 rounded-lg" required />
            </AdminField>
            <AdminField label="Описание">
              <Input name="description" className="h-10 rounded-lg" required />
            </AdminField>
            <AdminField label="Ссылка просмотра">
              <Input name="previewHref" className="h-10 rounded-lg" required />
            </AdminField>
            <AdminField label="Ссылка скачивания">
              <Input name="downloadHref" className="h-10 rounded-lg" required />
            </AdminField>
            <div className="md:col-span-2">
              <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                Добавить документ
              </button>
            </div>
          </form>
          <div className="space-y-2">
            {documents.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/80 p-3">
                <form action={upsertDocumentAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <p className="mb-2 text-xs text-muted-foreground">
                    Ученик: {item.user.fullName} ({item.user.email})
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminField label="Ученик" className="md:col-span-2">
                      <select
                        name="userId"
                        defaultValue={item.userId}
                        className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm"
                        required
                      >
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName} ({user.email})
                          </option>
                        ))}
                      </select>
                    </AdminField>
                    <AdminField label="Название документа">
                      <Input name="title" defaultValue={item.title} className="h-9 rounded-lg" />
                    </AdminField>
                    <AdminField label="Описание">
                      <Input name="description" defaultValue={item.description} className="h-9 rounded-lg" />
                    </AdminField>
                    <AdminField label="Ссылка просмотра">
                      <Input name="previewHref" defaultValue={item.previewHref} className="h-9 rounded-lg" />
                    </AdminField>
                    <AdminField label="Ссылка скачивания">
                      <Input name="downloadHref" defaultValue={item.downloadHref} className="h-9 rounded-lg" />
                    </AdminField>
                    <div className="md:col-span-2">
                      <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>
                        Сохранить документ
                      </button>
                    </div>
                  </div>
                </form>
                <AdminConfirmDeleteForm
                  action={deleteDocumentAction}
                  confirmMessage={`Удалить документ «${item.title}»?`}
                  hiddenFields={{ id: item.id }}
                  className="mt-2"
                >
                  <button type="submit" className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "rounded-lg")}>
                    Удалить документ
                  </button>
                </AdminConfirmDeleteForm>
              </div>
            ))}
          </div>
          <form action={updateManagerAction} className="grid gap-2">
            <Input name="name" defaultValue={manager?.name ?? ""} placeholder="Имя менеджера" className="h-10 rounded-lg" required />
            <Input name="role" defaultValue={manager?.role ?? ""} placeholder="Роль" className="h-10 rounded-lg" required />
            <Input name="about" defaultValue={manager?.about ?? ""} placeholder="Описание" className="h-10 rounded-lg" required />
            <Input name="photo" defaultValue={manager?.photo ?? "/career-manager.svg"} placeholder="Фото" className="h-10 rounded-lg" required />
            <Input name="telegramTag" defaultValue={manager?.telegramTag ?? ""} placeholder="Telegram" className="h-10 rounded-lg" required />
            <Input name="maxTag" defaultValue={manager?.maxTag ?? ""} placeholder="MAX" className="h-10 rounded-lg" required />
            <button type="submit" className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}>Сохранить менеджера</button>
          </form>
        </SectionCard>
      )}

      {tab === "profile" && (
        <SectionCard className="space-y-3">
          <h3 className="text-lg font-semibold">Профиль администратора</h3>
          <p className="text-sm text-muted-foreground">Имя: {admin.fullName}</p>
          <p className="text-sm text-muted-foreground">Email: {admin.email}</p>
          <p className="text-sm text-muted-foreground">Телефон: {admin.phone ?? "Не заполнен"}</p>
        </SectionCard>
      )}
    </div>
  );
}
