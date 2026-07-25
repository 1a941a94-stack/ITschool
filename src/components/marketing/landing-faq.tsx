"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Кто такой менеджер по продажам в видео-встрече?",
    a: "Это специалист, который проводит видео-встречи с клиентами, демонстрирует IT-продукты и помогает принять решение о покупке. Вы закрываете сделку на этапе первого контакта и напрямую влияете на рост компании и свой доход.",
  },
  {
    q: "Нужен ли опыт работы в IT?",
    a: "Нет. Программа рассчитана на старт с нуля: мы даём скрипты, практику на реальных кейсах и сопровождение до выхода к работодателям.",
  },
  {
    q: "Как проходит обучение?",
    a: "Онлайн-практика с живым тренером: теория, ролевые игры, разбор возражений и подготовка к трудоустройству.",
  },
  {
    q: "Можно ли совмещать с основной работой?",
    a: "Да. Формат удалённый, занятия проходят в сфокусированном интенсиве, а дальнейшая работа также строится онлайн через видео-встречи.",
  },
  {
    q: "Работа после обучения удалённая?",
    a: "Да. Для старта достаточно ноутбука и стабильного интернета — география не ограничивает.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {faqs.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-slate-900 sm:text-lg">{item.q}</span>
              <ChevronDown
                size={20}
                className={cn("shrink-0 text-blue-600 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-sm leading-relaxed text-slate-600 sm:text-base">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
