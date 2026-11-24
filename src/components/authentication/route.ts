"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Invalidate the cached Explore Studios data after an add/edit/delete.
export async function revalidateStudios() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;
  revalidatePath("/studios");
}

export async function forgotPassword(
  email: string,
  newPassword?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, error: "Email is required." };
  }

  const context = await auth.$context;
  const account = await context.internalAdapter.findUserByEmail(cleanEmail);
  if (!account) {
    return { ok: false, error: "No account found for this email address." };
  }

  if (newPassword === undefined) {
    return { ok: true };
  }

  const { minPasswordLength, maxPasswordLength } = context.password.config;

  if (newPassword.length < minPasswordLength) {
    return {
      ok: false,
      error: `Password must be at least ${minPasswordLength} characters.`,
    };
  }
  if (newPassword.length > maxPasswordLength) {
    return {
      ok: false,
      error: `Password must be at most ${maxPasswordLength} characters.`,
    };
  }
  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
    return {
      ok: false,
      error:
        "Password must include an uppercase letter and a lowercase letter.",
    };
  }

  const hash = await context.password.hash(newPassword);
  await context.internalAdapter.updatePassword(account.user.id, hash);
  await context.internalAdapter.deleteUserSessions(account.user.id);

  return { ok: true };
}
