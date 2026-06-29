import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireClientWithLegal } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireClientWithLegal();
  return <DashboardShell>{children}</DashboardShell>;
}
