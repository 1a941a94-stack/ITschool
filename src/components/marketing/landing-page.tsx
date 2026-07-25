import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  MessageSquareQuote,
  ShieldCheck,
  Users,
} from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LandingHeroBackdrop } from "@/components/marketing/landing-hero-backdrop";

type LandingPageProps = {
  isAuthenticated: boolean;
  isAdmin?: boolean;
};

const stats = [
  { value: "1000+", label: "выпускников центра" },
  { value: "4 дня", label: "интенсивной практики" },
  { value: "100%", label: "онлайн-формат" },
  { value: "с нуля", label: "до выхода к работодателям" },
];

const roleSteps = [
  {
    title: "Выявление потребностей",
    text: "Понимаете задачи клиента, его цели и критерии выбора IT-решения.",
  },
  {
    title: "Онлайн-встреча",
    text: "Проводите структурированный вводный урок в удобном для клиента формате.",
  },
  {
    title: "Демонстрация продукта",
    text: "Показываете ценность технологий на языке пользы, а не жаргона.",
  },
  {
    title: "Закрытие решения",
    text: "Помогаете принять решение и фиксируете следующий шаг сделки.",
  },
];

const benefits = [
  {
    icon: Globe2,
    title: "Удалённая работа",
    text: "Обучение и дальнейшая практика из любой точки мира — нужен ноутбук и интернет.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Доход без потолка",
    text: "Результат зависит от навыков и активности: рост идёт вместе с опытом и конверсией.",
  },
  {
    icon: GraduationCap,
    title: "Практика с тренером",
    text: "Живые занятия, скрипты, ролевые игры и разбор реальных кейсов IT-продаж.",
  },
  {
    icon: Users,
    title: "Сопровождение карьеры",
    text: "Резюме, подготовка к собеседованиям и выход к партнёрской сети работодателей.",
  },
];

const programDays = [
  {
    day: "01",
    title: "Основы профессии МВУ",
    text: "Погружение в воронку продаж, этапы работы с клиентом, психологию покупателя и ключевые метрики эффективности в IT-сегменте.",
  },
  {
    day: "02",
    title: "Техники продаж и коммуникации",
    text: "Скрипты, установление контакта, выявление потребностей, презентация продукта и работа с возражениями в реальном времени.",
  },
  {
    day: "03",
    title: "Практика и разбор кейсов",
    text: "Интенсивная отработка на кейсах IT-компаний: переговоры, типичные ошибки и способы их предотвращения.",
  },
  {
    day: "04",
    title: "Трудоустройство и карьера",
    text: "Профессиональное резюме, подготовка к собеседованиям, доступ к базе работодателей и рекомендации по росту дохода.",
  },
];

const outcomes = [
  {
    title: "Рабочие инструменты",
    text: "Чек-листы, скрипты, шаблоны и инструкции для первых встреч с клиентами.",
  },
  {
    title: "Сильное резюме",
    text: "Документ, который выделяет вас среди кандидатов на стартовые позиции в IT-продажах.",
  },
  {
    title: "Рекомендация центра",
    text: "Рекомендательное письмо от руководителя Центра IT Карьеры.",
  },
  {
    title: "База работодателей",
    text: "Партнёрские компании с понятными условиями для старта карьеры.",
  },
  {
    title: "Карьерное сопровождение",
    text: "Поддержка на этапах поиска работы и прохождения собеседований.",
  },
  {
    title: "Личный кабинет",
    text: "Доступ к материалам потока, расписанию, библиотеке и документам на одной платформе.",
  },
];

const trust = [
  {
    icon: Building2,
    title: "Официальная деятельность",
    text: "Работаем как зарегистрированный субъект предпринимательской деятельности в соответствии с законодательством РФ.",
  },
  {
    icon: MessageSquareQuote,
    title: "Тренеры-практики",
    text: "Преподаватели с опытом в IT-продажах и управлении командами — без «воды» и теории ради теории.",
  },
  {
    icon: ShieldCheck,
    title: "Прозрачные условия",
    text: "Оферта и политика обработки данных доступны до старта обучения — без скрытых сюрпризов.",
  },
];

export function LandingPage({ isAuthenticated, isAdmin }: LandingPageProps) {
  const cabinetHref = isAdmin ? "/admin" : "/app";
  const primaryHref = isAuthenticated ? cabinetHref : "/login";
  const primaryLabel = isAuthenticated ? "Перейти в кабинет" : "Войти в личный кабинет";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl bg-white p-1 shadow-[0_10px_30px_-16px_rgba(37,99,235,0.8)]"
            />
            <span className="font-[family-name:var(--font-landing-display)] text-base tracking-tight text-white sm:text-lg">
              Центр IT Карьеры
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a href="#profession" className="hidden rounded-full px-3 py-2 text-sm text-blue-100/80 transition hover:text-white lg:inline">
              О профессии
            </a>
            <a href="#program" className="hidden rounded-full px-3 py-2 text-sm text-blue-100/80 transition hover:text-white md:inline">
              Программа
            </a>
            <a href="#results" className="hidden rounded-full px-3 py-2 text-sm text-blue-100/80 transition hover:text-white lg:inline">
              Результаты
            </a>
            <a href="#faq" className="hidden rounded-full px-3 py-2 text-sm text-blue-100/80 transition hover:text-white sm:inline">
              FAQ
            </a>
            <Link
              href={primaryHref}
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-[0_12px_28px_-16px_rgba(255,255,255,0.9)] transition hover:bg-blue-50"
            >
              {isAuthenticated ? "Кабинет" : "Войти"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <LandingHeroBackdrop />
        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24">
          <FadeIn>
            <p className="font-[family-name:var(--font-landing-display)] text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Центр IT Карьеры
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl leading-[1.05] tracking-tight text-blue-100 sm:text-4xl md:text-5xl">
              Продавай технологии.
              <span className="block text-white">Создавай будущее.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100/75 sm:text-lg">
              Ведущий образовательный центр по подготовке менеджеров вводного урока в IT: практика с тренером,
              удалённый формат и сопровождение до трудоустройства.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
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

      <section className="border-b border-slate-200 bg-[#f5f7fb]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-slate-200 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="bg-[#f5f7fb] px-5 py-8 sm:px-8">
              <p className="font-[family-name:var(--font-landing-display)] text-3xl tracking-tight text-blue-600 sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="profession" className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">О профессии</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Менеджер вводного урока — точка входа в IT-продажи
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              МВУ проводит онлайн-встречи с клиентами, демонстрирует IT-продукты и помогает принять решение о покупке.
              Компании инвестируют в технологии каждый день — без сильного первого контакта сделки не случаются. Вы —
              тот, кто открывает этот путь.
            </p>
          </FadeIn>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {roleSteps.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * (index + 1)}>
                <article className="border-t border-slate-200 pt-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-blue-600 uppercase">
                    Шаг {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-landing-display)] text-xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fb] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">Почему МВУ</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Профессия с свободой формата и понятным ростом
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {benefits.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * (index + 1)}>
                <article className="flex gap-4 rounded-[1.75rem] border border-white bg-white/80 p-6 shadow-[0_20px_50px_-36px_rgba(37,99,235,0.45)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="program" className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">Программа</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Четыре дня интенсивного практического обучения
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Полностью онлайн. Живые занятия с тренером. Интерактивные практики и разбор реальных кейсов — без
              растянутых курсов «на полгода теории».
            </p>
          </FadeIn>
          <div className="mt-14 space-y-0">
            {programDays.map((item, index) => (
              <FadeIn key={item.day} delay={0.04 * (index + 1)}>
                <article className="grid gap-4 border-t border-slate-200 py-8 md:grid-cols-[120px_1fr] md:gap-10">
                  <p className="font-[family-name:var(--font-landing-display)] text-4xl tracking-tight text-blue-600">
                    {item.day}
                  </p>
                  <div>
                    <h3 className="font-[family-name:var(--font-landing-display)] text-2xl tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
            <div className="border-t border-slate-200" />
          </div>
        </div>
      </section>

      <section id="results" className="bg-slate-950 px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-300 uppercase">Результаты</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Полный комплект для старта карьеры в IT
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              После программы у вас есть не «сертификат ради галочки», а рабочие материалы, позиция на рынке и поддержка
              центра.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item, index) => (
              <FadeIn key={item.title} delay={0.04 * (index + 1)}>
                <article className="h-full border-t border-white/15 pt-5">
                  <div className="mb-3 text-blue-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">Доверие</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Центр IT Карьеры — не «курс в Telegram», а образовательная платформа
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {trust.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * (index + 1)}>
                <article className="h-full rounded-[1.75rem] border border-slate-200 bg-[#f5f7fb] p-6">
                  <item.icon className="text-blue-600" size={24} />
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f5f7fb] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">FAQ</p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-3xl tracking-tight sm:text-4xl">
              Ответы на частые вопросы
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Коротко о формате, требованиях и том, как устроена программа.
            </p>
          </FadeIn>
          <div className="mt-10">
            <LandingFaq />
          </div>
        </div>
      </section>

      <section id="lead" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#020617_0%,#1e3a8a_55%,#2563eb_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-200 uppercase">Старт</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-landing-display)] text-3xl tracking-tight text-white sm:text-4xl">
              Начните карьеру в IT с Центром IT Карьеры
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-100/80">
              Запишитесь на консультацию, чтобы обсудить программу, или войдите в личный кабинет, если вы уже участник
              потока.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://tsentritkareri.ru/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Записаться на консультацию
              </a>
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
              <p className="font-[family-name:var(--font-landing-display)] text-lg text-slate-900">Центр IT Карьеры</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Образовательная платформа подготовки менеджеров вводного урока в IT-сегменте. Обучение, практика и
              карьерное сопровождение в одном контуре.
            </p>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              ИП Нагорский Виктор Сергеевич · ИНН 615423320067 · ОГРНИП 326619600129345
            </p>
            <p className="mt-2 text-xs text-slate-400">
              © {new Date().getFullYear()} Центр IT Карьеры. Не является публичной офертой.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">Навигация</p>
              <a href="#profession" className="block text-slate-700 hover:text-blue-600">
                О профессии
              </a>
              <a href="#program" className="block text-slate-700 hover:text-blue-600">
                Программа
              </a>
              <a href="#results" className="block text-slate-700 hover:text-blue-600">
                Результаты
              </a>
              <a href="#faq" className="block text-slate-700 hover:text-blue-600">
                FAQ
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">Документы и вход</p>
              <Link href="/legal/offer.docx" className="block text-slate-700 hover:text-blue-600">
                Договор оферты
              </Link>
              <Link href="/legal/privacy-policy.docx" className="block text-slate-700 hover:text-blue-600">
                Политика персональных данных
              </Link>
              <Link href="/login" className="block text-slate-700 hover:text-blue-600">
                Вход в личный кабинет
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
