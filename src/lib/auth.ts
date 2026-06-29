import { randomBytes } from "crypto";
import { UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "citc_session";
const SESSION_DURATION_DAYS = 14;

export type AuthUser = {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string | null;
  legalAcceptedAt: Date | null;
};

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    id: session.user.id,
    role: session.user.role,
    fullName: session.user.fullName,
    email: session.user.email,
    phone: session.user.phone,
    legalAcceptedAt: session.user.legalAcceptedAt,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== UserRole.ADMIN) {
    redirect("/");
  }
  return user;
}

export async function requireClientWithLegal() {
  const user = await requireUser();
  if (user.role === UserRole.ADMIN) {
    redirect("/admin");
  }
  if (!user.legalAcceptedAt) {
    redirect("/accept-terms");
  }
  return user;
}

export async function loginWithCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) return null;

  await createSession(user.id);
  return user;
}
