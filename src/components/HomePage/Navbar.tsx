"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  Globe,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const accountLinks = [
  { label: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "Host Bookings", href: "/host-bookings", icon: ClipboardList },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarCheck },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name?: string | null) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const accountMenu = user && (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        render={
          <button
            type="button"
            aria-label="Open account menu"
            className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-muted"
          />
        }
      >
        <Avatar size="lg">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-semibold xl:inline">
          {user.name}
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground xl:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-foreground">
            <span className="block truncate text-sm font-semibold">{user.name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {accountLinks.map(({ label, href, icon: Icon }) => (
            <DropdownMenuItem key={href} render={<Link href={href} />}>
              <Icon />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const guestActions = (
    <>
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
    </>
  );

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

          {isPending ? (
            <div className="size-12 rounded-full bg-muted/60" aria-hidden="true" />
          ) : (
            <>
              {accountMenu}
              {!user && guestActions}
            </>
          )}

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
                      nativeButton={false}
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

                {user &&
                  accountLinks.map(({ label, href, icon: Icon }) => (
                    <SheetClose
                      key={href}
                      nativeButton={false}
                      render={
                        <Link
                          href={href}
                          className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-muted"
                        />
                      }
                    >
                      <Icon className="size-4" />
                      {label}
                    </SheetClose>
                  ))}
              </nav>
              <div className="flex gap-3 px-4 pb-6 pt-2 sm:hidden">
                {user ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-xl text-base font-semibold"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
