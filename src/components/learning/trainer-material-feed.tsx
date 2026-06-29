import Link from "next/link";
import { Link2 } from "lucide-react";

import type { TrainerFeedItem } from "@/types/platform";

type TrainerMaterialFeedProps = {
  items: TrainerFeedItem[];
};

export function TrainerMaterialFeed({ items }: TrainerMaterialFeedProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white/80 p-4">
            <p className="text-sm font-medium">{item.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{item.addedAt}</span>
              <Link href={item.href} className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                Открыть <Link2 size={13} />
              </Link>
            </div>
          </div>
        ))}
        {!items.length ? (
          <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-muted-foreground">
            После урока тренер может докрепить материалы, и они появятся в этой ленте.
          </p>
        ) : null}
      </div>
    </div>
  );
}
