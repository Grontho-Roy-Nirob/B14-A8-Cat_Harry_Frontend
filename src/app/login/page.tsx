"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Check, CircleExclamationPoint, Eye, EyeOff, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type LoginForm = {
  email: string
  password: string
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.96H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.29a12 12 0 0 0 0 10.74l3.99-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.52 11.52 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.99 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  )
}

const promoPoints = [
  "Hourly pricing you can see up front",
  "Slots locked once a host confirms",
  "PDF invoice for every booking",
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setToast(null)

    const formData = new FormData(event.currentTarget)
    const user = Object.fromEntries(formData.entries()) as LoginForm

    const { data, error } = await authClient.signIn.email({ ...user })

    if (data) {
      redirect("/login")
    }

    if (error) {
      setToast("Incorrect email or password. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    setToast(null)
    const { error } = await authClient.signIn.social({ provider: "google" })

    if (error) {
      setToast(error.message ?? "Could not continue with Google. Please try again.")
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center bg-[#f4f5fa] p-4 sm:p-6 lg:p-10">
      {toast && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-red-100 bg-white px-4 py-3 shadow-lg"
        >
          <CircleExclamationPoint className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p className="text-sm leading-snug text-[#141b2d]">{toast}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
            className="ml-auto rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] lg:min-h-[680px] lg:grid-cols-2">
        <section className="flex w-full items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-14">
          <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
            <CardHeader>
              <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
                Welcome back
              </p>
              <CardTitle className="mt-2 text-3xl font-extrabold tracking-tight text-[#141b2d]">
                Login to StudioSpace
              </CardTitle>
              <CardDescription>
                Pick up your bookings and listings where you left off.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="creator@example.com"
                      autoComplete="email"
                      required
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="#"
                        className="ml-auto text-sm font-medium text-brand underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="pr-10"
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
                    <Button type="submit" variant="brand" className="w-full">
                      Login
                    </Button>
                  </Field>

                  <FieldSeparator>or continue with</FieldSeparator>

                  <Field>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </Button>
                    <FieldDescription className="text-center">
                      New to StudioSpace?{" "}
                      <Link href="/register" className="font-semibold text-brand hover:underline">
                        Create an account
                      </Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#ffe8d6] via-[#fff3e8] to-[#e8ecff] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-20 size-[26rem] rounded-full bg-white/45 blur-2xl"
          />

          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
              For creators and hosts
            </p>
            <h2 className="mt-4 max-w-md text-4xl leading-tight font-extrabold tracking-tight text-[#141b2d] xl:text-[2.75rem]">
              Your next shoot is one booking away.
            </h2>
          </div>

          <div className="relative z-10 max-w-lg rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur">
            <ul className="space-y-3">
              {promoPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm font-semibold text-[#141b2d]">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
