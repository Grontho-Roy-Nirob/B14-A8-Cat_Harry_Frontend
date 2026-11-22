const steps = [
  {
    title: "Discover Spaces",
    description:
      "Filter by city, price or photo and find a room that fits the shoot.",
  },
  {
    title: "Select Shoot Hours",
    description:
      "Pick a date and only the hours that are actually free. No back-and-forth.",
  },
  {
    title: "Book Instantly",
    description:
      "Send the request in one click. The host confirms and you stay in the loop.",
  },
  {
    title: "Create & Produce",
    description:
      "Show up, set up and make the work. We handle the details in the background.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#f8f9fa] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
          How booking works
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl">
          From search to shoot day in four steps
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className={
                index === steps.length - 1
                  ? "rounded-xl bg-[#c2410c] p-6 text-white shadow-sm"
                  : "rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              }
            >
              <span
                className={
                  index === steps.length - 1
                    ? "grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-[#c2410c]"
                    : "grid size-9 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white"
                }
              >
                {index + 1}
              </span>
              <h3 className="mt-6 text-base font-semibold">{step.title}</h3>
              <p
                className={
                  index === steps.length - 1
                    ? "mt-3 text-xs leading-relaxed text-white/80"
                    : "mt-3 text-xs leading-relaxed text-muted-foreground"
                }
              >
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
