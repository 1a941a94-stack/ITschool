"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Главная" },
  { id: "learning", label: "Обучение" },
  { id: "schedule", label: "Расписание" },
  { id: "library", label: "Библиотека" },
  { id: "documents", label: "Документы" },
  { id: "profile", label: "Профиль" },
  { id: "users", label: "Пользователи" },
  { id: "flows", label: "Потоки" },
  { id: "news", label: "Новости" },
  { id: "materials", label: "Материалы" },
] as const;

export function AdminMobileMenu() {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "home";

  return (
    <div className="glass sticky top-0 z-20 mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/70 p-2 lg:hidden">
      {tabs.map((item) => (
        <Link
          key={item.id}
          href={`/admin?tab=${item.id}`}
          className={cn(
            "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-colors",
            tab === item.id ? "bg-primary text-white" : "bg-white/70 text-zinc-700",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
