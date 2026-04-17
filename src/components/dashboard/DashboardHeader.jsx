import { motion } from "framer-motion";

export const DashboardHeader = ({ userName }) => {
  return (
    <motion.section
      className="surface-panel relative overflow-hidden px-6 py-6 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-primary-violet/36 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-primary-pink/24 blur-3xl" />

      <div className="relative space-y-2">
        <p className="eyebrow">
          Daily Overview
        </p>
        <h1 className="font-display text-2xl text-brand-blue md:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-brand-blue/70 md:text-base">
          Here is your financial snapshot today.
        </p>
      </div>
    </motion.section>
  );
};
