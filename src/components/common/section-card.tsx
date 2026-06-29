import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        "glass rounded-3xl border border-white/60 bg-card/75 p-6 shadow-[0_12px_34px_-26px_rgba(15,23,42,0.45)] sm:p-7",
        className,
      )}
    >
      {children}
    </section>
  );
}
