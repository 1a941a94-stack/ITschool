import { cn } from "@/lib/utils";

type StatusPillProps = {
  status: "online" | "finished";
};

const statusMeta = {
  online: {
    label: "Онлайн",
    className: "bg-blue-100 text-blue-700",
  },
  finished: {
    label: "Завершено",
    className: "bg-zinc-200 text-zinc-700",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const meta = statusMeta[status];

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", meta.className)}>
      {meta.label}
    </span>
  );
}
