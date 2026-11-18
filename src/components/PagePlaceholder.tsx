import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export default function PagePlaceholder({
  eyebrow,
  title,
  description,
  action,
}: PagePlaceholderProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
      <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {action && (
          <CardContent>
            <Link href={action.href} className="text-sm font-semibold text-brand hover:underline">
              {action.label} &rarr;
            </Link>
          </CardContent>
        )}
      </Card>
    </main>
  );
}
