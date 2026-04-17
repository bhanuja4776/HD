import { motion } from "framer-motion";

export const SavingsTracker = ({ goalAmount, savedAmount }) => {
  const progress = goalAmount > 0 ? Math.min(100, Math.round((savedAmount / goalAmount) * 100)) : 0;

  return (
    <motion.section
      className="surface-card p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
    >
      <div className="space-y-1">
        <h2 className="font-display text-lg text-brand-blue">Savings Goal Tracker</h2>
        <p className="text-xs text-brand-blue/65">Goal INR {goalAmount.toLocaleString("en-IN")}</p>
      </div>

      <p className="mt-4 text-sm font-medium text-brand-blue">
        Saved INR {savedAmount.toLocaleString("en-IN")}
      </p>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-green/15">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-green to-[#34D399]"
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-brand-blue/65">
        <span>{progress}% of target achieved</span>
        <span>INR {(goalAmount - savedAmount).toLocaleString("en-IN")} to go</span>
      </div>
    </motion.section>
  );
};
