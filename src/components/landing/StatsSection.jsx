import { motion } from "framer-motion";

const accentStyles = {
  purple: "text-primary-pink",
  green: "text-brand-green",
  gold: "text-primary-gold"
};

const StatCard = ({ label, value, description, accent, index }) => (
  <motion.article
    className="surface-card flex flex-col gap-1 p-6"
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.45 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.32, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
  >
    <span className="text-xs text-brand-blue/60">{label}</span>
    <span className={`text-2xl font-bold ${accentStyles[accent] || "text-primary-pink"}`}>{value}</span>
    <p className="text-xs text-brand-blue/60">{description}</p>
  </motion.article>
);

export const StatsSection = () => (
  <section className="grid gap-4 md:grid-cols-3 md:gap-5">
    <StatCard
      index={0}
      accent="purple"
      label="Women feeling more confident"
      value="72%"
      description="report higher financial confidence after using Aarvika."
    />
    <StatCard
      index={1}
      accent="green"
      label="Financial decisions simulated"
      value="15K+"
      description="safe, risk-free decisions practiced in the simulator."
    />
    <StatCard
      index={2}
      accent="gold"
      label="Virtual investments practiced"
      value="₹3M+"
      description="of virtual capital explored without risking real money."
    />
  </section>
);

