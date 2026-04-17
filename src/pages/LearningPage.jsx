export const LearningPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-blue">Learning hub</h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Short, beginner-friendly lessons to help you understand saving, budgeting,
          and investing at your own pace.
        </p>
      </div>

      <section className="fin-card space-y-3 p-6">
        <h2 className="text-sm font-semibold text-brand-blue">Your lessons</h2>
        <p className="text-xs text-brand-blue/60">
          This page will later connect to real lesson content and track your progress.
        </p>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="fin-card p-4 space-y-1">
            <div className="text-xs text-brand-blue/60">Level 1 · Saving</div>
            <div className="font-semibold text-brand-blue">
              Saving money without sacrifice
            </div>
            <div className="text-[11px] text-brand-blue/60">Not started</div>
          </div>
          <div className="fin-card p-4 space-y-1">
            <div className="text-xs text-brand-blue/60">Level 1 · Budgeting</div>
            <div className="font-semibold text-brand-blue">
              Budgeting basics for households
            </div>
            <div className="text-[11px] text-brand-blue/60">Not started</div>
          </div>
          <div className="fin-card p-4 space-y-1">
            <div className="text-xs text-brand-blue/60">Level 2 · Investing</div>
            <div className="font-semibold text-brand-blue">
              What are mutual funds?
            </div>
            <div className="text-[11px] text-brand-blue/60">Not started</div>
          </div>
        </div>
      </section>
    </div>
  );
};