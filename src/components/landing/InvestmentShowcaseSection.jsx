import { motion } from "framer-motion";

const chartBars = [
  { label: "Month 1", height: "40%", color: "bg-white/15" },
  { label: "Month 3", height: "65%", color: "bg-primary-pink/60" },
  { label: "Month 6", height: "85%", color: "bg-primary-purple/85" },
  { label: "Month 12", height: "100%", color: "bg-primary-gold/80" }
];

export const InvestmentShowcaseSection = () => (
  <motion.section
    className="space-y-4"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.h2
      className="font-display text-xl md:text-2xl text-brand-blue"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.45, delay: 0.05 }}
    >
      Practice investing before you risk a rupee
    </motion.h2>
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center">
      <motion.div
        className="rounded-3xl bg-brand-dark text-white p-5 md:p-6 shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-purple/45 via-primary-pink/20 to-primary-gold/20 opacity-60" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="uppercase tracking-[0.18em] font-semibold text-white/70">
              Investment simulator
            </span>
            <span className="text-white/70">Demo portfolio</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {chartBars.map((bar, index) => (
              <motion.div
                key={bar.label}
                className={`flex-1 rounded-t-xl ${bar.color}`}
                style={{ height: bar.height, transformOrigin: "bottom" }}
                initial={{ scaleY: 0.1, opacity: 0.4 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.55,
                  delay: 0.2 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-white/70">
            {chartBars.map((bar, index) => (
              <motion.span
                key={bar.label}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.25, delay: 0.34 + index * 0.08 }}
              >
                {bar.label}
              </motion.span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs text-white/70">Simulated growth</div>
              <motion.div
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.35, delay: 0.72 }}
              >
                +12.8%
              </motion.div>
            </div>
            <div className="text-[11px] text-white/80 max-w-xs">
              Adjust allocations between FDs, mutual funds, gold, and savings
              to see how risk and returns change over time.
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="space-y-3 text-sm text-brand-blue/80"
        initial={{ opacity: 0, x: 22 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <p>
          Most platforms expect you to invest real money on day one. Aarvika lets
          you experiment first, with a safe, interactive simulator.
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Allocate virtual money across popular instruments.</li>
          <li>See how returns evolve over different time horizons.</li>
          <li>Understand risk and reward before making real decisions.</li>
        </ul>
      </motion.div>
    </div>
  </motion.section>
);

