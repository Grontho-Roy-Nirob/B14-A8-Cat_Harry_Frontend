"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LogIn, Menu, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto grid h-22 w-full max-w-[112rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:gap-8 lg:px-10 xl:px-16">
        <Link
          href="/"
          aria-label="StudioSpace home"
          className="flex shrink-0 items-center gap-3 justify-self-start"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f97316] text-white">
            <Globe className="size-6" strokeWidth={2} />
          </span>
          <span className="text-[1.625rem] leading-none font-extrabold tracking-tight text-foreground">
            StudioSpace
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-base transition-colors hover:text-foreground",
                  active
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="size-12 rounded-xl"
          >
            <Sun className="size-5 dark:hidden" />
            <Moon className="hidden size-5 dark:block" />
          </Button>

          <Button
            variant="softBrand"
            nativeButton={false}
            render={<Link href="/login" />}
            className="hidden h-12 min-w-25 rounded-xl px-6 text-base font-semibold sm:inline-flex"
          >
            <LogIn className="size-4" />
            Login
          </Button>

          <Button
            variant="brand"
            nativeButton={false}
            render={<Link href="/register" />}
            className="hidden h-12 min-w-32 rounded-xl bg-[#f97316]! px-6 text-base font-semibold text-white! hover:bg-[#ea580c]! sm:inline-flex"
          >
            Register
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  aria-label="Open menu"
                  className="size-12 rounded-xl lg:hidden"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader className="border-b">
                <SheetTitle>
                  <span className="text-xl font-extrabold tracking-tight">
                    StudioSpace
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 px-4 pb-2"
              >
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);

                  return (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            "rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-muted",
                            active && "bg-brand/10 text-brand"
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="flex gap-3 px-4 pb-6 pt-2 sm:hidden">
                <Button
                  variant="softBrand"
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="h-12 flex-1 rounded-xl text-base font-semibold"
                >
                  <LogIn className="size-4" />
                  Login
                </Button>
                <Button
                  variant="brand"
                  nativeButton={false}
                  render={<Link href="/register" />}
                  className="h-12 flex-1 rounded-xl bg-[#f97316]! text-base font-semibold text-white! hover:bg-[#ea580c]!"
                >
                  Register
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
