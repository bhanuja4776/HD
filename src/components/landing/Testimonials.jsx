const testimonials = [
  {
    quote:
      "Aarvika finally explained budgeting in a way that made sense to me. Now I know exactly where my money goes each month.",
    author: "Meera, 32, homemaker"
  },
  {
    quote:
      "Being able to try investing with virtual money removed my fear. When I invest for real, I know what to expect.",
    author: "Ananya, 24, first-time investor"
  }
];

export const Testimonials = () => {
  return (
    <section className="surface-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-20 -left-20 h-52 w-52 rounded-full bg-primary-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-primary-purple/15 blur-3xl" />

      <div className="relative space-y-6">
        <div className="space-y-2">
          <p className="eyebrow">
            Testimonials
          </p>
          <h2 className="font-display text-2xl text-brand-blue md:text-3xl">
            Built for real women, not Wall Street
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={item.author}
              className="surface-card bg-brand-background/80 p-6"
            >
              <p className="text-sm leading-relaxed text-brand-blue/85">"{item.quote}"</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-brand-blue/60">
                - {item.author}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
