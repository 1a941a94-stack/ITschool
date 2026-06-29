import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

import { LoginHeroPanel } from "@/components/auth/login-hero-panel";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser, loginWithCredentials } from "@/lib/auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === UserRole.ADMIN) redirect("/admin");
    redirect("/");
  }

  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";

    const parsed = loginSchema.safeParse({
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? ""),
    });

    if (!parsed.success) {
      redirect("/login?error=validation");
    }

    const account = await loginWithCredentials(parsed.data.email, parsed.data.password);
    if (!account) {
      redirect("/login?error=credentials");
    }

    if (account.role === UserRole.ADMIN) {
      redirect("/admin");
    }
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] lg:grid lg:grid-cols-2">
      <LoginHeroPanel />

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_28px_70px_-36px_rgba(37,99,235,0.35)] backdrop-blur-xl sm:p-10">
            <div className="mb-8 lg:hidden">
              <p className="text-xs font-semibold tracking-[0.24em] text-blue-600 uppercase">Центр IT Карьеры</p>
            </div>
            <div className="mb-8">
              <p className="hidden text-xs font-semibold tracking-[0.24em] text-blue-600 uppercase lg:block">
                Личный кабинет
              </p>
              <h1 className="mt-0 text-3xl font-semibold tracking-tight text-zinc-900 lg:mt-3">
                Вход в личный кабинет
              </h1>
            </div>

            {params.error ? (
              <p className="mb-5 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-700">
                {params.error === "credentials"
                  ? "Неверный email или пароль."
                  : "Проверьте корректность введённых данных."}
              </p>
            ) : null}

            <form action={loginAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.ru"
                  className="h-12 rounded-2xl border-zinc-200/80 bg-white/90 shadow-inner shadow-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                  Пароль
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-zinc-200/80 bg-white/90 shadow-inner shadow-white/40"
                  required
                />
              </div>
              <button
                type="submit"
                className={cn(
                  buttonVariants(),
                  "h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-base font-semibold shadow-[0_16px_32px_-18px_rgba(37,99,235,0.95)] transition hover:from-blue-500 hover:to-blue-600",
                )}
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
