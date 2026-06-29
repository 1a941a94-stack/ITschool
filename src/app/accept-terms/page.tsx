import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { acceptLegalAction } from "@/app/accept-terms/actions";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ error?: string }>;

export default async function AcceptTermsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  if (user.role === UserRole.ADMIN) {
    redirect("/admin");
  }
  if (user.legalAcceptedAt) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_28px_70px_-36px_rgba(37,99,235,0.35)] backdrop-blur-xl sm:p-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-blue-600 uppercase">Центр IT Карьеры</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">Подтверждение условий</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Для продолжения работы на платформе ознакомьтесь с документами и подтвердите согласие.
        </p>

        {params.error === "required" ? (
          <p className="mt-5 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-sm text-red-700">
            Нужно принять оба условия, чтобы продолжить.
          </p>
        ) : null}

        <form action={acceptLegalAction} className="mt-8 space-y-5">
          <label className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-700">
            <input
              type="checkbox"
              name="acceptOffer"
              className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-blue-600"
              required
            />
            <span>
              Я принимаю условия{" "}
              <Link href="/legal/offer.docx" target="_blank" className="font-medium text-blue-600 hover:underline">
                оферты
              </Link>
              . С документом ознакомлен.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-700">
            <input
              type="checkbox"
              name="acceptPrivacy"
              className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-blue-600"
              required
            />
            <span>
              Я согласен на обработку моих персональных данных. С{" "}
              <Link
                href="/legal/privacy-policy.docx"
                target="_blank"
                className="font-medium text-blue-600 hover:underline"
              >
                Политикой обработки персональных данных
              </Link>{" "}
              ознакомлен.
            </span>
          </label>

          <button type="submit" className={cn(buttonVariants(), "h-12 w-full rounded-2xl text-base font-semibold")}>
            Продолжить на платформу
          </button>
        </form>
      </div>
    </div>
  );
}
