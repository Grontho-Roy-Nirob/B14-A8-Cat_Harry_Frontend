import Link from "next/link";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const popularCategories = [
  "Photo Studios",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const socials = [
  {
    label: "X",
    href: "https://x.com",
    hoverClass: "hover:border-black hover:text-black",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    hoverClass: "hover:border-[#1877F2] hover:text-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    hoverClass: "hover:border-[#E4405F] hover:text-[#E4405F]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    hoverClass: "hover:border-[#FF0000] hover:text-[#FF0000]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f1f3f5] text-slate-900">
      <div className="mx-auto w-full max-w-[112rem] px-6 lg:px-10 xl:px-16">
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-8">
          <div className="flex flex-col items-start">
            <Link
              href="/"
              aria-label="StudioSpace home"
              className="flex items-center gap-3"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#f97316] text-white">
                <Globe className="size-5" strokeWidth={2} />
              </span>
              <span className="text-xl leading-none font-extrabold tracking-tight text-slate-900">
                StudioSpace
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Our mission is to put every creator in the right room, and every
              great room in front of the right creator.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                    social.hoverClass
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">Quick links</h2>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Popular categories
            </h2>
            <ul className="mt-4 space-y-2.5">
              {popularCategories.map((category) => (
                <li key={category}>
                  <Link
                    href="/studios"
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-bold text-slate-900">
              Studio news in your inbox
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              New rooms and host tips, once a month.
            </p>
            <div className="mt-4 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                aria-label="Email address"
                placeholder="you@gmail.com"
                className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:border-[#f97316] focus-visible:ring-3 focus-visible:ring-[#f97316]/20"
              />
              <Button
                type="button"
                className="h-10 shrink-0 rounded-lg bg-[#c2410c]! px-5 text-sm font-semibold text-white! hover:bg-[#a33008]!"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 py-5">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 StudioSpace. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <Link href="/terms" className="transition-colors hover:text-slate-900">
                Terms of Service
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/privacy" className="transition-colors hover:text-slate-900">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
