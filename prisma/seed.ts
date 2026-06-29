import { CohortStatus, MaterialKind, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import { prisma } from "../src/lib/prisma";

async function main() {
  const adminPasswordHash = await hash("admin12345", 10);
  const clientPasswordHash = await hash("client12345", 10);

  const [admin, client] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@career-center.ru" },
      update: {},
      create: {
        email: "admin@career-center.ru",
        fullName: "Администратор Центра",
        role: UserRole.ADMIN,
        phone: "+7 (999) 100-00-00",
        passwordHash: adminPasswordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: "student@career-center.ru" },
      update: {},
      create: {
        email: "student@career-center.ru",
        fullName: "Алина Волкова",
        role: UserRole.CLIENT,
        phone: "+7 (999) 123-45-67",
        passwordHash: clientPasswordHash,
      },
    }),
  ]);

  await prisma.cohort.deleteMany();
  await prisma.news.deleteMany();
  await prisma.libraryItem.deleteMany();
  await prisma.employmentDocument.deleteMany();
  await prisma.careerManager.deleteMany();

  const currentCohort = await prisma.cohort.create({
    data: {
      name: "Поток Июль 2026",
      description: "Текущий поток обучения менеджеров IT-продаж.",
      status: CohortStatus.CURRENT,
      currentDayNumber: 3,
    },
  });

  const recruitingCohort = await prisma.cohort.create({
    data: {
      name: "Поток Август 2026",
      description: "Набор в следующий поток.",
      status: CohortStatus.RECRUITING,
      currentDayNumber: 1,
    },
  });

  const days = [
    {
      dayNumber: 1,
      slug: "day-1",
      title: "День 1. Введение в IT-продажи",
      date: new Date("2026-07-02T19:00:00.000Z"),
      startAt: "19:00",
      description: "Роль менеджера, структура IT-продукта и базовая воронка коммуникации.",
      meetingLink: "https://meet.example.com/day-1",
      agenda: JSON.stringify(["Рынок EdTech", "Фрейм оценки клиента", "Сценарий первого звонка"]),
      isCompleted: true,
    },
    {
      dayNumber: 2,
      slug: "day-2",
      title: "День 2. Методика SPIN",
      date: new Date("2026-07-04T19:00:00.000Z"),
      startAt: "19:00",
      description: "Практика вопросов Situation, Problem, Implication, Need-payoff.",
      meetingLink: "https://meet.example.com/day-2",
      agenda: JSON.stringify(["SPIN в B2C", "Ошибки при диагностике", "Шаблон разговора"]),
      isCompleted: true,
    },
    {
      dayNumber: 3,
      slug: "day-3",
      title: "День 3. Работа с возражениями",
      date: new Date("2026-07-06T19:00:00.000Z"),
      startAt: "19:00",
      description: "Отработка частых возражений и переход к следующему шагу.",
      meetingLink: "https://meet.example.com/day-3",
      agenda: JSON.stringify(["Матрица возражений", "Формула ответа", "Закрепление в кейсах"]),
      isCompleted: true,
    },
    {
      dayNumber: 4,
      slug: "day-4",
      title: "День 4. Скрипты и итоговая сборка",
      date: new Date("2026-07-09T19:00:00.000Z"),
      startAt: "19:00",
      description: "Собираем персональный скрипт, чек-лист и сценарии под тип клиента.",
      meetingLink: "https://meet.example.com/day-4",
      agenda: JSON.stringify(["Архитектура скрипта", "Чек-лист звонка", "План роста на 90 дней"]),
      isCompleted: false,
    },
    {
      dayNumber: 5,
      slug: "day-5",
      title: "День 5. Финальный маршрут трудоустройства",
      date: new Date("2026-07-12T19:00:00.000Z"),
      startAt: "19:00",
      description: "Финальная сессия и передача в сопровождение карьерному менеджеру.",
      meetingLink: "https://meet.example.com/day-5",
      agenda: JSON.stringify(["Итоговый план", "Подготовка к собеседованию", "Передача сопровождения"]),
      isCompleted: false,
    },
  ];

  const createdDays = [];
  for (const day of days) {
    const created = await prisma.learningDay.create({
      data: { ...day, cohortId: currentCohort.id },
    });
    createdDays.push(created);
  }

  await prisma.learningDay.create({
    data: {
      cohortId: recruitingCohort.id,
      dayNumber: 1,
      slug: "aug-day-1",
      title: "День 1. Старт следующего потока",
      date: new Date("2026-08-10T19:00:00.000Z"),
      startAt: "19:00",
      description: "Подготовительный модуль для нового потока.",
      meetingLink: "https://meet.example.com/aug-day-1",
      agenda: JSON.stringify(["Онбординг", "Цели обучения"]),
      isCompleted: false,
    },
  });

  await prisma.enrollment.createMany({
    data: [
      { userId: client.id, cohortId: currentCohort.id },
      { userId: client.id, cohortId: recruitingCohort.id },
    ],
  });

  const day3 = createdDays.find((item) => item.dayNumber === 3);
  if (day3) {
    await prisma.lessonMaterial.createMany({
      data: [
        { learningDayId: day3.id, title: "Запись занятия", href: "#", kind: MaterialKind.RECORDING, isTrainerFeed: false },
        { learningDayId: day3.id, title: "Презентация", href: "#", kind: MaterialKind.PRESENTATION, isTrainerFeed: false },
        { learningDayId: day3.id, title: "PDF-конспект", href: "#", kind: MaterialKind.PDF, isTrainerFeed: false },
        { learningDayId: day3.id, title: "Чек-лист по возражениям", href: "#", kind: MaterialKind.EXTRA, isTrainerFeed: true },
      ],
    });
    await prisma.dayScheduleItem.createMany({
      data: [
        {
          learningDayId: day3.id,
          startAt: "10:00",
          endAt: "12:00",
          title: "Видеовстреча с тренером",
          format: "Онлайн созвон",
          sortOrder: 1,
        },
        {
          learningDayId: day3.id,
          startAt: "12:00",
          endAt: "14:00",
          title: "Изучение материалов дня",
          format: "Самостоятельно",
          sortOrder: 2,
        },
      ],
    });
  }

  await prisma.news.createMany({
    data: [
      {
        cohortId: currentCohort.id,
        title: "Открыт доступ к текущему дню",
        description: "Третий день уже доступен. Все предыдущие дни остаются открытыми.",
      },
      {
        cohortId: recruitingCohort.id,
        title: "Идет набор в следующий поток",
        description: "Августовский поток открыт для назначения новых участников.",
      },
    ],
  });

  await prisma.libraryItem.createMany({
    data: [
      { title: "SPIN: быстрый справочник", category: "SPIN", type: "pdf", href: "https://drive.example.com/spin-guide" },
      { title: "Скрипт первого звонка", category: "Скрипты", type: "doc", href: "https://drive.example.com/first-call-script" },
      { title: "Чек-лист подготовки к звонку", category: "Чек-листы", type: "pdf", href: "https://drive.example.com/pre-call-checklist" },
    ],
  });

  await prisma.employmentDocument.createMany({
    data: [
      {
        userId: client.id,
        title: "Резюме",
        description: "Подготовлено Центром IT Карьеры.",
        previewHref: "#",
        downloadHref: "#",
      },
      {
        userId: client.id,
        title: "Рекомендательное письмо",
        description: "Готовый документ для отклика и интервью.",
        previewHref: "#",
        downloadHref: "#",
      },
      {
        userId: client.id,
        title: "Сопроводительное письмо",
        description: "Адаптированный шаблон под позиции junior/middle.",
        previewHref: "#",
        downloadHref: "#",
      },
    ],
  });

  await prisma.careerManager.create({
    data: {
      name: "Максим Лебедев",
      role: "Карьерный менеджер",
      about: "Сопровождает выпускников после пятого дня, помогает с откликами и интервью.",
      photo: "/career-manager.svg",
      telegramTag: "@max_career_manager",
      maxTag: "@max.career",
    },
  });

  console.log("Seed complete");
  console.log(`Admin login: ${admin.email} / admin12345`);
  console.log(`Client login: ${client.email} / client12345`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
