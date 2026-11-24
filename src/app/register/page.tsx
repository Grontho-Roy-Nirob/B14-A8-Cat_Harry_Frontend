"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Eye, EyeOff, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type SignUpForm = {
  name: string
  image: string
  email: string
  password: string
}

const passwordRules = [
  { label: "Must include an uppercase letter", passes: (value: string) => /[A-Z]/.test(value) },
  { label: "Must include a lowercase letter", passes: (value: string) => /[a-z]/.test(value) },
  { label: "At least 6 characters", passes: (value: string) => value.length >= 6 },
]

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read the selected file."))
    reader.onload = () => {
      const source = reader.result as string
      const image = new window.Image()
      image.onerror = () => reject(new Error("The selected file is not a valid image."))
      image.onload = () => {
        const scale = Math.min(1, 512 / Math.max(image.width, image.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext("2d")
        if (!context) {
          resolve(source)
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.8))
      }
      image.src = source
    }
    reader.readAsDataURL(file)
  })
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

export default function RegisterPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [photo, setPhoto] = useState<{ name: string; dataUrl: string } | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ""
    if (!file) return

    setPhotoError(null)

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.")
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Please choose an image smaller than 5 MB.")
      return
    }

    try {
      setPhoto({ name: file.name, dataUrl: await readPhoto(file) })
    } catch (cause) {
      setPhotoError(cause instanceof Error ? cause.message : "Could not load that image.")
    }
  }

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const user = Object.fromEntries(formData.entries()) as SignUpForm
    if (photo) user.image = photo.dataUrl

    const { data, error } = await authClient.signUp.email({ ...user })

    if (data) {
      toast.add({
        type: "success",
        title: "Account created!",
        description: "Welcome to StudioSpace. Let's get you signed in.",
      })
      router.push("/login")
    }

    if (error) {
      toast.add({
        type: "error",
        title: "We couldn't create your account",
        description: error.message ?? "Please check your details and try again.",
      })
    }
  }

  const handleGoogleSignUp = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })

    if (error) {
      toast.add({
        type: "error",
        title: "Google sign-up didn't work",
        description: error.message ?? "We couldn't continue with Google. Please try again.",
      })
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-5.5rem)] items-center justify-center bg-[#f4f5fa] p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)] lg:min-h-[680px] lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#eaf0ff] via-[#f1edff] to-[#fdeaf5] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-white/45 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-20 right-8 size-52 rounded-full bg-white/30"
          />

          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
              Two ways to use StudioSpace
            </p>
            <h1 className="mt-4 max-w-md text-4xl leading-tight font-extrabold tracking-tight text-[#141b2d] xl:text-[2.75rem]">
              Rent a room today. List yours tomorrow.
            </h1>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="font-semibold text-[#141b2d]">As a creator</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Search, compare and book studio hours in a few taps.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="font-semibold text-[#141b2d]">As a host</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                List your space, set your rate and manage requests from one place.
              </p>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-12">
          <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
            <CardHeader className="text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
                Join StudioSpace
              </p>
              <CardTitle className="mt-2 text-3xl font-extrabold tracking-tight text-[#141b2d]">
                Create your account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignUp}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Grontho Roy"
                      autoComplete="name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="grontho@example.com"
                      autoComplete="email"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="image">Photo URL</FieldLabel>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      placeholder="https://example.com/your-photo.jpg"
                      required={!photo}
                    />
                    <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-2.5">
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoChange}
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand hover:underline"
                      >
                        <Upload className="size-4" />
                        Upload from your device
                      </label>
                      {photo && (
                        <div className="ml-auto flex min-w-0 items-center gap-2">
                          <Image
                            src={photo.dataUrl}
                            alt="Selected photo preview"
                            width={36}
                            height={36}
                            unoptimized
                            className="size-9 shrink-0 rounded-full object-cover"
                          />
                          <span className="max-w-28 truncate text-xs text-muted-foreground">
                            {photo.name}
                          </span>
                          <button
                            type="button"
                            aria-label="Remove uploaded photo"
                            onClick={() => setPhoto(null)}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    {photoError && (
                      <FieldDescription className="text-destructive">
                        {photoError}
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
                    <ul className="mt-2 space-y-1">
                      {passwordRules.map((rule) => {
                        const passes = rule.passes(password)
                        return (
                          <li
                            key={rule.label}
                            className={cn(
                              "flex items-center gap-1.5 text-xs",
                              passes ? "text-green-600" : "text-destructive"
                            )}
                          >
                            {passes ? (
                              <Check className="size-3.5 shrink-0" />
                            ) : (
                              <X className="size-3.5 shrink-0" />
                            )}
                            {rule.label}
                          </li>
                        )
                      })}
                    </ul>
                  </Field>

                  <Field>
                    <Button type="submit" variant="brand" className="w-full">
                      Register
                    </Button>
                    <FieldDescription className="text-center">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-brand hover:underline"
                      >
                        Login
                      </Link>
                    </FieldDescription>
                  </Field>

                  <FieldSeparator>or</FieldSeparator>

                  <Field>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignUp}
                    >
                      <GoogleIcon />
                      Sign up with Google
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
