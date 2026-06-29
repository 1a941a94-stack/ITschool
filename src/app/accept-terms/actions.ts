"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function acceptLegalAction(formData: FormData) {
  const user = await requireUser();
  if (user.role === UserRole.ADMIN) {
    redirect("/admin");
  }
  if (user.legalAcceptedAt) {
    redirect("/");
  }

  const acceptOffer = formData.get("acceptOffer") === "on";
  const acceptPrivacy = formData.get("acceptPrivacy") === "on";
  if (!acceptOffer || !acceptPrivacy) {
    redirect("/accept-terms?error=required");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { legalAcceptedAt: new Date() },
  });

  redirect("/");
}
