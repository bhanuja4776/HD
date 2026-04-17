const StepCard = ({ step, title, text }) => (
  <div className="surface-card p-6">
    <div className="flex items-center gap-2 mb-2">
      <span className="h-6 w-6 rounded-full bg-primary-purple text-white text-xs flex items-center justify-center font-semibold">
        {step}
      </span>
      <span className="font-semibold text-sm text-brand-blue">{title}</span>
    </div>
    <p className="text-sm text-brand-blue/70">{text}</p>
  </div>
);

export const HowItWorksSection = () => (
  <section className="space-y-4">
    <h2 className="font-display text-xl md:text-2xl text-brand-blue">
      How Aarvika works
    </h2>
    <div className="grid gap-4 md:grid-cols-4 text-sm">
      <StepCard
        step="1"
        title="Learn the basics"
        text="Short, beginner-friendly lessons explain saving, budgeting, and investing."
      />
      <StepCard
        step="2"
        title="Plan your budget"
        text="Track income and expenses to see exactly where your money goes."
      />
      <StepCard
        step="3"
        title="Practice investing"
        text="Use virtual money to explore FDs, mutual funds, gold, and more."
      />
      <StepCard
        step="4"
        title="Ask Aarvika anything"
        text="Get AI guidance in simple language whenever you feel stuck."
      />
    </div>
  </section>
);

