import { motion } from "framer-motion";

const toneClassMap = {
  savings: "from-brand-green/30 to-brand-green/5 text-brand-green border-brand-green/30",
  spending: "from-brand-red/24 to-brand-red/5 text-brand-red border-brand-red/30",
  remaining: "from-primary-gold/38 to-primary-gold/12 text-primary-gold border-primary-gold/40",
  growth: "from-primary-purple/24 to-primary-violet/20 text-primary-purple border-primary-purple/30"
};

const changeToneClassMap = {
  savings: "text-brand-green",
  spending: "text-brand-red",
  remaining: "text-primary-gold",
  growth: "text-primary-purple"
};

export const FinancialCards = ({ cards }) => {
  return (
    <motion.section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08
          }
        }
      }}
    >
      {cards.map((card) => (
        <motion.article
          key={card.title}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
            }
          }}
          className="surface-card p-6"
        >
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br ${
              toneClassMap[card.tone] || toneClassMap.savings
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M4 12h16" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-blue/55">
            {card.title}
          </p>
          <p className="mt-2 text-2xl font-bold text-brand-blue">{card.value}</p>
          <p className={`mt-1 text-xs font-medium ${changeToneClassMap[card.tone] || "text-brand-blue/70"}`}>
            {card.change}
          </p>
          <p className="mt-2 text-xs text-brand-blue/65">{card.description}</p>
        </motion.article>
      ))}
    </motion.section>
  );
};
