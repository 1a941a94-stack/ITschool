import Image from "next/image";
import { AtSign, UserRoundCheck } from "lucide-react";

import type { CareerManager } from "@/types/platform";
import { SectionCard } from "@/components/common/section-card";

type CareerManagerCardProps = {
  manager: CareerManager;
};

export function CareerManagerCard({ manager }: CareerManagerCardProps) {
  return (
    <SectionCard>
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        <UserRoundCheck size={14} />
        Карьерное сопровождение после 5-го дня
      </p>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative h-28 w-28 overflow-hidden rounded-3xl bg-blue-100">
          <Image src={manager.photo} alt={manager.name} fill className="object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{manager.name}</h3>
          <p className="text-sm text-muted-foreground">{manager.role}</p>
          <p className="mt-2 text-sm text-muted-foreground">{manager.about}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-xl bg-white/80 px-3 py-2 text-sm">
              <AtSign size={14} />
              Telegram: {manager.telegramTag}
            </span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-white/80 px-3 py-2 text-sm">
              <AtSign size={14} />
              MAX: {manager.maxTag}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
