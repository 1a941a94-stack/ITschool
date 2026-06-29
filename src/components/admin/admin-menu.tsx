"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Home,
  Megaphone,
  Settings2,
  ShieldUser,
  UserRound,
  Users,
} from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";

import { cn } from "@/lib/utils";

const adminTabs = [
  { id: "home", label: "Главная", icon: Home },
  { id: "learning", label: "Обучение", icon: GraduationCap },
  { id: "schedule", label: "Расписание", icon: CalendarDays },
  { id: "library", label: "Библиотека", icon: BookOpen },
  { id: "documents", label: "Документы", icon: FileText },
  { id: "profile", label: "Профиль", icon: UserRound },
  { id: "users", label: "Пользователи", icon: Users },
  { id: "flows", label: "Потоки", icon: Settings2 },
  { id: "news", label: "Новости", icon: Megaphone },
  { id: "materials", label: "Материалы", icon: ShieldUser },
] as const;

export function AdminMenu() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "home";

  return (
    <aside className="glass hidden w-[272px] shrink-0 rounded-[28px] border border-white/70 p-4 shadow-[0_20px_40px_-34px_rgba(37,99,235,0.55)] lg:flex lg:flex-col">
      <div className="mb-8 rounded-2xl bg-white/80 p-4">
        <Link href="/admin" className="block">
          <SiteLogo className="mx-auto" />
        </Link>
        <p className="mt-3 text-center text-sm font-medium text-zinc-700">Админ кабинет</p>
      </div>
      <nav className="space-y-2">
        {adminTabs.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === tab;
          return (
            <Link
              key={item.id}
              href={`/admin?tab=${item.id}`}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)]"
                  : "text-zinc-700 hover:bg-white/80 hover:text-zinc-900",
              )}
            >
              <Icon size={18} className={cn("transition-transform", !isActive && "group-hover:-translate-y-0.5")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
