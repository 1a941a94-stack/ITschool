import { Mail, Phone, Shield, UserCircle2 } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { FadeIn } from "@/components/common/fade-in";
import { PageHeading } from "@/components/common/page-heading";
import { SectionCard } from "@/components/common/section-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { changePasswordAction } from "./actions";

type SearchParams = Promise<{ passwordUpdated?: string; passwordError?: string }>;

export default async function ProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const params = await searchParams;
  const passwordUpdated = params.passwordUpdated === "1";
  const passwordError = params.passwordError;

  return (
    <div className="space-y-5">
      <FadeIn>
        <PageHeading
          eyebrow="Профиль"
          title="Личные данные"
          description="Управление профилем и доступом к аккаунту."
        />
      </FadeIn>

      <FadeIn delay={0.08}>
        <SectionCard>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-3 md:w-52">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                <UserCircle2 size={48} />
              </div>
              <p className="text-sm font-medium">{user.fullName}</p>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Имя</label>
                <Input value={user.fullName} readOnly className="h-12 rounded-2xl bg-white/80" />
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <Phone size={13} />
                  Телефон
                </label>
                <Input value={user.phone ?? "Не заполнено"} readOnly className="h-12 rounded-2xl bg-white/80" />
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <Mail size={13} />
                  Email
                </label>
                <Input value={user.email} readOnly className="h-12 rounded-2xl bg-white/80" />
              </div>
              <div className="mt-2 sm:col-span-2">
                <LogoutButton className="rounded-xl bg-white/80" />
              </div>
            </div>
          </div>
        </SectionCard>
      </FadeIn>

      <SectionCard className="space-y-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold">
          <Shield size={16} />
          Смена пароля
        </div>

        {passwordUpdated ? (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">Пароль успешно изменён.</p>
        ) : null}
        {passwordError === "current" ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">Текущий пароль указан неверно.</p>
        ) : null}
        {passwordError === "validation" ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            Проверьте поля: новый пароль не короче 8 символов и должен совпадать с подтверждением.
          </p>
        ) : null}

        <form action={changePasswordAction} className="grid max-w-md gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Текущий пароль</label>
            <Input name="currentPassword" type="password" className="h-11 rounded-xl bg-white/80" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Новый пароль</label>
            <Input
              name="newPassword"
              type="password"
              minLength={8}
              placeholder="Минимум 8 символов"
              className="h-11 rounded-xl bg-white/80"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Повторите новый пароль</label>
            <Input
              name="confirmPassword"
              type="password"
              minLength={8}
              className="h-11 rounded-xl bg-white/80"
              required
            />
          </div>
          <button type="submit" className={cn(buttonVariants(), "h-11 rounded-xl")}>
            Сохранить пароль
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
