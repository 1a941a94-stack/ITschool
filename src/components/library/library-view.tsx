"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { Input } from "@/components/ui/input";

type LibraryViewItem = {
  id: string;
  title: string;
  category: string;
  type: string;
  href: string;
  updatedAt: string;
};

type LibraryViewProps = {
  items: LibraryViewItem[];
};

export function LibraryView({ items }: LibraryViewProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");

  const categories = useMemo(() => {
    const source = new Set(items.map((item) => item.category));
    return ["Все", ...Array.from(source)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const byCategory = category === "Все" || item.category === category;
      const byQuery = item.title.toLowerCase().includes(query.toLowerCase());
      return byCategory && byQuery;
    });
  }, [category, items, query]);

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Библиотека"
          title="Материалы обучения"
          description="Поиск и быстрый доступ к полезным материалам по продажам, SPIN и рабочим скриптам."
        />
      </FadeIn>

      <FadeIn delay={0.06}>
        <SectionCard className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по материалам"
              className="h-12 rounded-2xl border-white/70 bg-white/80 pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  category === item ? "bg-primary text-white" : "bg-white/80 text-zinc-700 hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </SectionCard>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item, index) => (
          <FadeIn key={item.id} delay={0.04 * (index + 1)}>
            <SectionCard className="h-full">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <BookOpen size={13} />
                {item.category}
              </p>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex rounded-lg bg-white px-3 py-1 text-xs font-medium text-blue-700 hover:underline"
              >
                Открыть материал
              </a>
              <p className="mt-2 text-sm text-muted-foreground">Обновлено: {item.updatedAt}</p>
            </SectionCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
