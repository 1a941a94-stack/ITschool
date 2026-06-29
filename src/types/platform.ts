export type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
};

export type MaterialItem = {
  id: string;
  title: string;
  category: string;
  type: "pdf" | "video" | "doc" | "slides";
  updatedAt: string;
};

export type LessonMaterial = {
  id: string;
  title: string;
  kind: "recording" | "presentation" | "pdf" | "extra";
  href: string;
};

export type TrainerFeedItem = {
  id: string;
  title: string;
  type: "recording" | "presentation" | "pdf" | "extra";
  href: string;
  addedAt: string;
};

export type LearningDay = {
  id: string;
  dayNumber: number;
  slug: string;
  title: string;
  date: string;
  startAt: string;
  description: string;
  isCurrent: boolean;
  isCompleted: boolean;
  meetingLink: string;
  agenda: string[];
  materials: LessonMaterial[];
  trainerFeed: TrainerFeedItem[];
};

export type ScheduleItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  status: "online" | "finished";
  isCurrent: boolean;
};

export type DocumentCard = {
  id: string;
  title: string;
  description: string;
  previewHref: string;
  downloadHref: string;
};

export type CareerManager = {
  name: string;
  role: string;
  about: string;
  photo: string;
  telegramTag: string;
  maxTag: string;
};
