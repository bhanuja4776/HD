import { motion } from "framer-motion";

const accentStyles = {
  purple: {
    badge: "bg-primary-pink/12 text-primary-pink",
    bar: "from-primary-purple to-primary-pink",
    glow: "bg-primary-violet/30"
  },
  green: {
    badge: "bg-brand-green/12 text-brand-green",
    bar: "from-brand-green to-emerald-400",
    glow: "bg-brand-green/28"
  },
  gold: {
    badge: "bg-primary-gold/14 text-primary-gold",
    bar: "from-primary-gold to-amber-400",
    glow: "bg-primary-gold/28"
  }
};

const featureItems = [
  {
    badge: "Budget intelligence",
    title: "Smart budget and expense tracking",
    description: "See where your money goes every month and uncover actionable savings opportunities.",
    accent: "purple"
  },
  {
    badge: "Simulation",
    title: "Investment simulator",
    description: "Practice investing in mutual funds, FDs, gold, and other options with virtual money.",
    accent: "green"
  },
  {
    badge: "Learning",
    title: "Financial learning hub",
    description: "Bite-sized lessons that explain complex finance concepts in friendly, everyday language.",
    accent: "gold"
  },
  {
    badge: "Awareness",
    title: "Government scheme finder",
    description: "Discover support schemes and eligibility opportunities personalized to your profile.",
    accent: "purple"
  },
  {
    badge: "AI mentor",
    title: "AI financial assistant",
    description: "Ask money questions anytime and get clear, non-judgmental guidance in seconds.",
    accent: "green"
  }
];

const FeatureCard = ({ title, badge, description, accent, index }) => {
  const style = accentStyles[accent] || accentStyles.purple;

  return (
    <motion.article
      className="surface-card group flex flex-col gap-3 p-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${style.bar}`} />
      <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-medium ${style.badge}`}>
        {badge}
      </span>
      <h3 className="text-sm font-semibold text-brand-blue">{title}</h3>
      <p className="text-sm text-brand-blue/72">{description}</p>
      <div className={`pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${style.glow} opacity-70`} />
    </motion.article>
  );
};

export const FeaturesSection = () => (
  <section className="space-y-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
      <h2 className="font-display text-2xl text-brand-blue md:text-3xl">
        Confident finance, step by step
      </h2>
      <p className="max-w-md text-sm text-brand-blue/72">
        Aarvika brings learning, budgeting, investing simulations, and AI guidance into one uplifting fintech experience.
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      {featureItems.map((item, index) => (
        <FeatureCard
          key={item.title}
          badge={item.badge}
          title={item.title}
          description={item.description}
          accent={item.accent}
          index={index}
        />
      ))}
    </div>
  </section>
);

