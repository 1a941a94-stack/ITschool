import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { clearSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  async function logoutAction() {
    "use server";
    await clearSession();
    redirect("/login");
  }

  return (
    <form action={logoutAction}>
      <button type="submit" className={cn(buttonVariants({ variant: "secondary" }), className)}>
        <LogOut size={16} />
        Выйти
      </button>
    </form>
  );
}
