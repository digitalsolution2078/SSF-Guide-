import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "./db";

const COOKIE = "ssf_admin_session";
const PENDING_COOKIE = "ssf_admin_2fa";
const SESSION_HOURS = 8;
const isProd = process.env.NODE_ENV === "production";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export interface AdminSession {
  userId: string;
  email: string;
  role: string;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await prisma.auditLog.create({
    data: { actorId: user.id, action: "LOGIN", entity: "AdminUser", entityId: user.id },
  });
  return { userId: user.id, email: user.email, role: user.role };
}

export async function createSession(session: AdminSession): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/* ── Two-factor authentication (TOTP) ───────────────────────────────── */

/** Verify email+password only. Returns whether 2FA is required; does not log in. */
export async function verifyPassword(
  email: string,
  password: string,
): Promise<{ userId: string; totpEnabled: boolean } | null> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { userId: user.id, totpEnabled: user.totpEnabled };
}

export async function verifyTotp(userId: string, code: string): Promise<boolean> {
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user?.totpSecret) return false;
  try {
    return authenticator.check(code.replace(/\s+/g, ""), user.totpSecret);
  } catch {
    return false;
  }
}

export async function setPending2FA(userId: string): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .sign(secret());
  (await cookies()).set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/admin",
    maxAge: 300,
  });
}

export async function getPending2FA(): Promise<string | null> {
  const token = (await cookies()).get(PENDING_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return String(payload.userId);
  } catch {
    return null;
  }
}

export async function clearPending2FA(): Promise<void> {
  (await cookies()).delete(PENDING_COOKIE);
}

/** Complete login: audit, timestamp, issue the session cookie, clear pending. */
export async function finalizeLogin(userId: string): Promise<void> {
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return;
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await prisma.auditLog.create({
    data: { actorId: user.id, action: "LOGIN", entity: "AdminUser", entityId: user.id },
  });
  await createSession({ userId: user.id, email: user.email, role: user.role });
  await clearPending2FA();
}
