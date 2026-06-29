import { MobileNav } from "@/components/layout/mobile-nav";
import { SideNav } from "@/components/layout/side-nav";
import { TopBar } from "@/components/layout/top-bar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-5 px-4 pb-8 pt-4 sm:px-6 sm:pt-6 lg:gap-6 lg:px-8">
      <SideNav />
      <div className="min-w-0 flex-1">
        <MobileNav />
        <TopBar />
        <main className="space-y-5">{children}</main>
      </div>
    </div>
  );
}
