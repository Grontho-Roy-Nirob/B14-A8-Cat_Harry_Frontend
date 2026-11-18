"use server";

import { auth } from "@/lib/auth";

type ForgotPasswordResult =
  | { ok: true; matched?: boolean; updated?: boolean }
  | { ok: false; error: string };

export async function forgotPassword(
  email: string,
  newPassword?: string
): Promise<ForgotPasswordResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { ok: false, error: "Email is required." };
  }

  const context = await auth.$context;
  const account = await context.internalAdapter.findUserByEmail(normalizedEmail);
  if (!account) {
    return { ok: false, error: "No account found for this email address." };
  }

  // Step 1: email matched — let the client show the password form.
  if (newPassword === undefined) {
    return { ok: true, matched: true };
  }

  // Step 2: validate, hash and write the new password to MongoDB.
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
      error: "Password must include an uppercase letter and a lowercase letter.",
    };
  }

  const hash = await context.password.hash(newPassword);
  await context.internalAdapter.updatePassword(account.user.id, hash);
  await context.internalAdapter.deleteUserSessions(account.user.id);

  return { ok: true, updated: true };
}
