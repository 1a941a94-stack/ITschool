"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/data/platform-data";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="glass sticky top-0 z-20 mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/70 p-2 lg:hidden">
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-colors",
              isActive ? "bg-primary text-white" : "bg-white/70 text-zinc-700",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
