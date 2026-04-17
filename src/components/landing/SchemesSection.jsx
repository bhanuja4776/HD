const schemes = [
  {
    title: "PM Mudra Yojana",
    description:
      "Supports small businesses with collateral-free loans to help women launch or scale ventures."
  },
  {
    title: "Stand Up India",
    description:
      "Enables women entrepreneurs to access institutional credit for greenfield enterprises."
  },
  {
    title: "Women Entrepreneurship Platform",
    description:
      "Provides guidance, resources, and ecosystem support for women building sustainable businesses."
  }
];

export const SchemesSection = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="eyebrow">
          Financial Inclusion
        </p>
        <h2 className="font-display text-2xl text-brand-blue md:text-3xl">
          Government Schemes for Women
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-brand-blue/75 md:text-base">
          Discover popular programs that can support business growth, financial access,
          and entrepreneurship journeys for women across India.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {schemes.map((scheme) => (
          <article
            key={scheme.title}
            className="surface-card p-6"
          >
            <h3 className="text-base font-semibold text-brand-blue">{scheme.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-blue/70">{scheme.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
