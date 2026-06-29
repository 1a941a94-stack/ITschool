"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileText,
  GraduationCap,
  Home,
  Library,
  UserRound,
} from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";

import { navItems } from "@/data/platform-data";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  GraduationCap,
  CalendarDays,
  Library,
  FileText,
  UserRound,
};

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="glass hidden w-[272px] shrink-0 rounded-[28px] border border-white/70 p-4 shadow-[0_20px_40px_-34px_rgba(37,99,235,0.55)] lg:flex lg:flex-col">
      <div className="mb-8 rounded-2xl bg-white/80 p-4">
        <Link href="/" className="block">
          <SiteLogo className="mx-auto" />
        </Link>
        <p className="mt-3 text-center text-sm font-medium text-zinc-700">Личный кабинет</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = iconMap[item.icon as keyof typeof iconMap];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-[0_12px_24px_-14px_rgba(37,99,235,0.9)]"
                  : "text-zinc-700 hover:bg-white/80 hover:text-zinc-900",
              )}
            >
              <Icon
                size={18}
                className={cn("transition-transform", !isActive && "group-hover:-translate-y-0.5")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
