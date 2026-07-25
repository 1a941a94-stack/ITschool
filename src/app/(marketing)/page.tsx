import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";

import { LandingPage } from "@/components/marketing/landing-page";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const landingSans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-landing-sans",
});

const landingDisplay = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-landing-display",
});

export const metadata: Metadata = {
  title: "Центр IT Карьеры — профессия менеджера вводного урока в IT",
  description:
    "Центр IT Карьеры — образовательная платформа подготовки менеджеров вводного урока в IT. Практика с тренером, удалённый формат и сопровождение до трудоустройства.",
  openGraph: {
    title: "Центр IT Карьеры",
    description:
      "Продавай технологии. Создавай будущее. Обучение профессии МВУ в IT с практикой и карьерным сопровождением.",
    type: "website",
    locale: "ru_RU",
  },
};

export default async function MarketingHomePage() {
  const user = await getCurrentUser();

  return (
    <div className={`${landingSans.variable} ${landingDisplay.variable} font-[family-name:var(--font-landing-sans)]`}>
      <LandingPage isAuthenticated={Boolean(user)} isAdmin={user?.role === UserRole.ADMIN} />
    </div>
  );
}
