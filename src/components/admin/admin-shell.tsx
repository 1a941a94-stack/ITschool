import { LogoutButton } from "@/components/auth/logout-button";
import { AdminMenu } from "@/components/admin/admin-menu";
import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-5 px-4 pb-8 pt-4 sm:px-6 sm:pt-6 lg:gap-6 lg:px-8">
      <AdminMenu />
      <div className="min-w-0 flex-1">
        <AdminMobileMenu />
        <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_10px_32px_-26px_rgba(15,23,42,0.6)] sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Центр IT Карьеры</p>
            <h1 className="text-base font-semibold sm:text-lg">Управление платформой</h1>
          </div>
          <LogoutButton className="rounded-xl bg-white/80" />
        </header>
        <main className="space-y-5">{children}</main>
      </div>
    </div>
  );
}
