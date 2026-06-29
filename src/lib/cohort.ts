const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

const DEFAULT_MEETING_LINK = "https://telemost.yandex.ru/j/74499866272904";

type CohortDayTemplate = {
  dayNumber: number;
  slug: string;
  title: string;
  startAt: string;
  description: string;
  agenda: string[];
};

const DEFAULT_COHORT_DAY_TEMPLATES: CohortDayTemplate[] = [
  {
    dayNumber: 1,
    slug: "day-1",
    title: "Основа профессии",
    startAt: "11:00",
    description: "Подготовка МВУ",
    agenda: ["Рынок EdTech", "Фрейм оценки клиента", "Сценарий первого звонка"],
  },
  {
    dayNumber: 2,
    slug: "day-2",
    title: "Искусство презентации",
    startAt: "11:00",
    description: "Подготовка МВУ",
    agenda: ["SPIN в B2C", "Ошибки при диагностике", "Шаблон разговора"],
  },
  {
    dayNumber: 3,
    slug: "day-3",
    title: "Уверенность в диалоге",
    startAt: "11:00",
    description: "Подготовка МВУ",
    agenda: ["Матрица возражений", "Формула ответа", "Закрепление в кейсах"],
  },
  {
    dayNumber: 4,
    slug: "day-4",
    title: "Финальная практика",
    startAt: "11:00",
    description: "Подготовка МВУ",
    agenda: ["Финальная ролевая игра", "Аттестация и оценка", "Закрепление в кейсах"],
  },
];

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function addDays(date: Date, offset: number): Date {
  const result = startOfLocalDay(date);
  result.setDate(result.getDate() + offset);
  return result;
}

export function formatDefaultCohortName(date = new Date()): string {
  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  return `Поток ${day} ${month}`;
}

export function formatDefaultCohortDescription(date = new Date()): string {
  return `Обучение менеджеров IT-продаж — ${formatDefaultCohortName(date)}.`;
}

export function buildDefaultCohortDays(startDate = new Date()) {
  const start = startOfLocalDay(startDate);

  return DEFAULT_COHORT_DAY_TEMPLATES.map((template) => ({
    dayNumber: template.dayNumber,
    slug: template.slug,
    title: template.title,
    date: addDays(start, template.dayNumber - 1),
    startAt: template.startAt,
    description: template.description,
    meetingLink: DEFAULT_MEETING_LINK,
    agenda: JSON.stringify(template.agenda),
    isCompleted: false,
  }));
}
