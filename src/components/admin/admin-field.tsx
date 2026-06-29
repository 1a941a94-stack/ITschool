import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function AdminField({ label, children, className }: AdminFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
