"use server";

import { hash, compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    redirect("/app/profile?passwordError=validation");
  }

  const account = await prisma.user.findUnique({ where: { id: user.id } });
  if (!account) {
    redirect("/app/profile?passwordError=validation");
  }

  const isCurrentValid = await compare(parsed.data.currentPassword, account.passwordHash);
  if (!isCurrentValid) {
    redirect("/app/profile?passwordError=current");
  }

  const passwordHash = await hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  redirect("/app/profile?passwordUpdated=1");
}
