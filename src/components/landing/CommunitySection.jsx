export const CommunitySection = () => (
  <section className="surface-panel bg-gradient-to-r from-white to-primary-purple/5 p-6 md:p-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <p className="eyebrow">
          Community
        </p>
        <h2 className="font-display text-2xl text-brand-blue md:text-3xl">
          Learn with a supportive financial community
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-blue/75 md:text-base">
          Join monthly learning circles, practical money challenges, and
          beginner-friendly conversations designed for women building financial confidence.
        </p>
      </div>
      <button type="button" className="btn-primary w-fit text-sm">
        Join Community Circle
      </button>
    </div>
  </section>
);

