const LessonTile = ({ title, level }) => (
  <div className="surface-card flex flex-col gap-1 p-6">
    <span className="text-xs text-brand-blue/60">{level}</span>
    <h3 className="font-semibold text-sm text-brand-blue">{title}</h3>
    <p className="text-xs text-brand-blue/70">
      5–7 minute lesson with relatable examples and simple language.
    </p>
  </div>
);

export const LearningHubSection = () => (
  <section className="space-y-4">
    <h2 className="font-display text-xl md:text-2xl text-brand-blue">
      Learn finance in plain language
    </h2>
    <div className="grid gap-4 md:grid-cols-3">
      <LessonTile title="Saving money without sacrifice" level="Level 1 · Saving" />
      <LessonTile title="Budgeting basics for households" level="Level 1 · Budgeting" />
      <LessonTile title="What are mutual funds?" level="Level 2 · Investing" />
    </div>
  </section>
);

