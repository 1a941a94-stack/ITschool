import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, Laptop, MapPin, ShieldCheck } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { cn } from "@/lib/utils";

type LandingPageProps = {
  isAuthenticated: boolean;
  isAdmin?: boolean;
};

const programDays = [
  {
    day: "День 1",
    title: "Основы профессии МВУ",
    text: "Воронка продаж, этапы работы с клиентом и ключевые метрики в IT-сегменте.",
  },
  {
    day: "День 2",
    title: "Техники продаж и коммуникации",
    text: "Скрипты, установление контакта, выявление потребностей и работа с возражениями.",
  },
  {
    day: "День 3",
    title: "Практика и разбор кейсов",
    text: "Ролевые игры, переговоры и разбор реальных сценариев IT-компаний.",
  },
  {
    day: "День 4",
    title: "Трудоустройство и карьера",
    text: "Резюме, подготовка к собеседованиям и выход к партнёрам-работодателям.",
  },
];

const outcomes = [
  "Готовые скрипты, чек-листы и шаблоны для работы",
  "Профессиональное резюме под IT-продажи",
  "Рекомендация от Центра IT Карьеры",
  "Сопровождение на этапе поиска работы",
];

export function LandingPage({ isAuthenticated, isAdmin }: LandingPageProps) {
  const cabinetHref = isAdmin ? "/admin" : "/app";
  const primaryHref = isAuthenticated ? cabinetHref : "/login";
  const primaryLabel = isAuthenticated ? "Перейти в кабинет" : "Войти в личный кабинет";

  return (
    <div className="landing-root min-h-screen text-[#10241c]">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.png" alt="" width={40} height={40} className="h-10 w-10 rounded-lg bg-white/90 p-1" />
            <span className="font-[family-name:var(--font-landing-display)] text-lg tracking-tight text-white sm:text-xl">
              Центр IT Карьеры
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#program"
              className="hidden rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white md:inline"
            >
              Программа
            </a>
            <a
              href="#lead"
              className="hidden rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white sm:inline"
            >
              Консультация
            </a>
            <Link
              href={primaryHref}
              className="rounded-full bg-[#3dcf7a] px-4 py-2.5 text-sm font-semibold text-[#062316] transition hover:bg-[#57d98b]"
            >
              {isAuthenticated ? "Кабинет" : "Войти"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#0b2a1c]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(61,207,122,0.28),transparent_45%),radial-gradient(ellipse_at_80%_10%,rgba(180,255,210,0.12),transparent_40%),linear-gradient(165deg,#0b2a1c_0%,#123728_48%,#0a2218_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-[70%] w-[70%] max-w-3xl rounded-full bg-[radial-gradient(circle,rgba(61,207,122,0.22),transparent_68%)] blur-2xl"
        />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24">
          <FadeIn>
            <p className="font-[family-name:var(--font-landing-display)] text-4xl leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Центр IT Карьеры
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl leading-[1.05] tracking-tight text-[#d8ffe8] sm:text-4xl md:text-5xl">
              Продавай технологии.
              <br />
              Создавай будущее.
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Освойте профессию менеджера вводного урока в IT: удалённая работа, практика с тренером и выход к
              работодателям.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3dcf7a] px-6 py-3.5 text-sm font-semibold text-[#062316] transition hover:bg-[#57d98b]"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#lead"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Записаться на консультацию
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="program" className="bg-[#f3f7f4] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#1f6b45] uppercase">Программа</p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight text-[#10241c] sm:text-4xl">
              Четыре дня интенсивной практики
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#3d5248]">
              Полностью онлайн. Живые занятия с тренером, разбор кейсов и инструменты для старта в профессии.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {programDays.map((item, index) => (
              <FadeIn key={item.day} delay={0.05 * (index + 1)}>
                <article className="border-t border-[#10241c]/15 pt-5">
                  <p className="text-sm font-semibold text-[#1f6b45]">{item.day}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-landing-display)] text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#3d5248]">{item.text}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#1f6b45] uppercase">Результат</p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Всё нужное для старта в IT-продажах
            </h2>
            <ul className="mt-8 space-y-4">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#3d5248] sm:text-base">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#1f6b45]" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { icon: Laptop, title: "Удалённый формат", text: "Обучение и работа из любой точки." },
                { icon: GraduationCap, title: "Практика с тренером", text: "Живые занятия и разбор кейсов." },
                { icon: MapPin, title: "Выход к работодателям", text: "Партнёрская сеть и сопровождение." },
                { icon: ShieldCheck, title: "Официальная оферта", text: "Прозрачные условия обучения." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl bg-[#f3f7f4] p-5">
                  <item.icon className="text-[#1f6b45]" size={22} />
                  <h3 className="mt-4 font-semibold text-[#10241c]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3d5248]">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="lead" className="bg-[#0b2a1c] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#3dcf7a] uppercase">Старт</p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Начните карьеру в IT уже сегодня
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
              Оставьте заявку на консультацию или войдите в личный кабинет, если вы уже участник программы.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://tsentritkareri.ru/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#3dcf7a] px-6 py-3.5 text-sm font-semibold text-[#062316] transition hover:bg-[#57d98b]"
              >
                Записаться на консультацию
              </a>
              <Link
                href={primaryHref}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10",
                )}
              >
                {primaryLabel}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-[#10241c]/10 bg-[#f3f7f4] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-landing-display)] text-xl text-[#10241c]">Центр IT Карьеры</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#3d5248]">
              Образовательная платформа подготовки менеджеров вводного урока в IT-сегменте.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#5a7166]">
              ИП Нагорский Виктор Сергеевич · ИНН 615423320067 · ОГРНИП 326619600129345
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/legal/offer.docx" className="text-[#1f6b45] hover:underline">
              Договор оферты
            </Link>
            <Link href="/legal/privacy-policy.docx" className="text-[#1f6b45] hover:underline">
              Политика обработки персональных данных
            </Link>
            <Link href="/login" className="text-[#1f6b45] hover:underline">
              Вход в личный кабинет
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
