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

export function formatDefaultCohortName(date = new Date()): string {
  const day = date.getDate();
  const month = MONTHS_GENITIVE[date.getMonth()];
  return `Поток ${day} ${month}`;
}

export function formatDefaultCohortDescription(date = new Date()): string {
  return `Обучение менеджеров IT-продаж — ${formatDefaultCohortName(date)}.`;
}
