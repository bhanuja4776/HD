const pathModules = [
  {
    title: "Beginner Financial Basics",
    summary:
      "Understand income, expenses, emergency funds, and practical money habits.",
    level: "Level 1"
  },
  {
    title: "Budget Planning",
    summary:
      "Create monthly plans, set realistic limits, and maintain spending discipline.",
    level: "Level 1"
  },
  {
    title: "Investment Fundamentals",
    summary:
      "Learn risk, diversification, and how mutual funds and SIPs work.",
    level: "Level 2"
  },
  {
    title: "Long Term Wealth Building",
    summary:
      "Build a long-view strategy for goals like education, home, and retirement.",
    level: "Level 3"
  }
];

export const LearningPath = () => {
  return (
    <section className="surface-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-20 -right-24 h-52 w-52 rounded-full bg-primary-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-primary-purple/15 blur-3xl" />

      <div className="relative space-y-5">
        <div className="space-y-2">
          <p className="eyebrow">
            Learning Hub
          </p>
          <h2 className="font-display text-2xl text-brand-blue md:text-3xl">Learning Path</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-brand-blue/75 md:text-base">
            A guided progression of lessons built to take you from financial basics
            to confident, long-term wealth decisions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pathModules.map((module) => (
            <article
              key={module.title}
              className="surface-card bg-brand-background/65 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-purple/85">
                {module.level}
              </p>
              <h3 className="mt-2 text-base font-semibold text-brand-blue">{module.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-blue/70">{module.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
