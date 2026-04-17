const steps = [
  {
    title: "Track Your Budget",
    description:
      "Capture income and expenses in one place so your monthly cash flow is always visible.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M4 5.5h16" />
        <path d="M4 12h16" />
        <path d="M4 18.5h16" />
        <circle cx="7" cy="5.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="11" cy="18.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    title: "Learn Financial Basics",
    description:
      "Follow beginner lessons that explain saving, debt, and planning in simple language.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M5 4.5h11a2 2 0 0 1 2 2V19a1 1 0 0 1-1.6.8L11 16l-5.4 3.8A1 1 0 0 1 4 19V6.5a2 2 0 0 1 2-2Z" />
        <path d="M8 9h6" />
        <path d="M8 12h6" />
      </svg>
    )
  },
  {
    title: "Practice Investing Safely",
    description:
      "Use simulations to test decisions before committing real money to any instrument.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M4 17.5 9.2 12l3.4 3.6L20 8" />
        <path d="M20 12V8h-4" />
        <rect x="3.5" y="4" width="17" height="16" rx="3" />
      </svg>
    )
  },
  {
    title: "Build Financial Confidence",
    description:
      "Receive clear AI guidance and turn your plans into consistent long-term habits.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M12 3.5 5.5 6v5.8c0 4.1 2.8 7.7 6.5 8.7 3.7-1 6.5-4.6 6.5-8.7V6L12 3.5Z" />
        <path d="m9.4 12.1 1.8 1.8 3.5-3.5" />
      </svg>
    )
  }
];

export const HowItWorks = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="eyebrow">
          Product Flow
        </p>
        <h2 className="font-display text-2xl text-brand-blue md:text-3xl">How It Works</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {steps.map((step) => (
          <article
            key={step.title}
            className="surface-card p-6"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-purple/15 to-primary-pink/25 text-primary-purple">
              {step.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-brand-blue">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-blue/70">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
