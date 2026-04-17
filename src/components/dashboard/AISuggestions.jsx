import { motion } from "framer-motion";

export const AISuggestions = ({ message }) => {
  return (
    <motion.section
      className="surface-card relative overflow-hidden border-primary-purple/15 p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      <div className="pointer-events-none absolute -top-14 -right-12 h-36 w-36 rounded-full bg-primary-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-primary-purple/15 blur-3xl" />

      <div className="relative space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-purple/20 bg-primary-purple/5 px-3 py-1 text-xs font-semibold text-primary-purple">
          <span className="h-2 w-2 rounded-full bg-primary-purple" />
          AI Financial Insight
        </div>
        <p className="text-sm leading-relaxed text-brand-blue/80">{message}</p>
      </div>
    </motion.section>
  );
};
