"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CircleCheck, Eye, EyeOff, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/components/authentication/route";

const passwordRules = [
  { label: "Must include an uppercase letter", passes: (value: string) => /[A-Z]/.test(value) },
  { label: "Must include a lowercase letter", passes: (value: string) => /[a-z]/.test(value) },
  { label: "At least 6 characters", passes: (value: string) => value.length >= 6 },
];

function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {passwordRules.map((rule) => {
        const passes = rule.passes(value);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-xs ${passes ? "text-green-600" : "text-destructive"}`}
          >
            {passes ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <X className="size-3.5 shrink-0" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [matchedEmail, setMatchedEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailCheck = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await forgotPassword(email);

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Could not check this email. Please try again.");
      return;
    }

    setMatchedEmail(email);
  };

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!passwordRules.every((rule) => rule.passes(password))) {
      setError(
        "Password must include an uppercase letter, a lowercase letter, and at least 6 characters."
      );
      return;
    }
    if (!passwordRules.every((rule) => rule.passes(confirmPassword))) {
      setError(
        "Confirm password must include an uppercase letter, a lowercase letter, and at least 6 characters."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!matchedEmail) {
      setError("Please check your email again.");
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(matchedEmail, password);

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Could not update your password. Please try again.");
      return;
    }

    setSuccess(true);
  };

  return (
    <main className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center bg-[#f4f5fa] p-4 sm:p-6 lg:p-10">
      <Card className="w-full max-w-md border-0 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
        <CardHeader>
          <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
            Account recovery
          </p>
          <CardTitle className="mt-2 text-3xl font-extrabold tracking-tight text-[#141b2d]">
            {success
              ? "Password updated"
              : matchedEmail
                ? "Set a new password"
                : "Forgot your password?"}
          </CardTitle>
          <CardDescription>
            {success
              ? "You can now login with your new password."
              : matchedEmail
                ? `Choose a new password for ${matchedEmail}.`
                : "Enter your registered email to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3 rounded-xl bg-brand/5 p-6 text-center">
                <CircleCheck className="size-10 text-brand" />
                <p className="text-sm text-muted-foreground">
                  Your password has been saved to your account.
                </p>
              </div>
              <Button
                variant="brand"
                className="w-full"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Go to login
              </Button>
            </div>
          ) : matchedEmail ? (
            <form onSubmit={handlePasswordReset}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="pr-10"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                  <PasswordChecklist value={confirmPassword} />
                </Field>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Field>
                  <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save new password"}
                  </Button>
                  <FieldDescription className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMatchedEmail(null);
                        setPassword("");
                        setConfirmPassword("");
                        setError(null);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                    >
                      <ArrowLeft className="size-3.5" />
                      Use a different email
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={handleEmailCheck}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="creator@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Field>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Field>
                  <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Checking..." : "Continue"}
                  </Button>
                  <FieldDescription className="text-center">
                    Remembered it?{" "}
                    <Link href="/login" className="font-semibold text-brand hover:underline">
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
