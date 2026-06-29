import Image from "next/image";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Image
      src="/logo-it.png"
      alt="Центр IT Карьеры"
      width={200}
      height={200}
      className={cn("mx-auto h-auto w-full max-w-[132px]", className)}
      priority
    />
  );
}
