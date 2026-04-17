import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LotusLogo } from "../branding/LotusLogo";

const MotionLink = motion(Link);

const sectionVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] }
  }
};

export const HeroSection = () => {
  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl gradient-hero px-6 py-10 text-white shadow-[0_32px_66px_-28px_rgba(79,70,229,0.86)] md:px-12 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.28 }}
    >
      <motion.div
        className="pointer-events-none absolute -left-14 -top-16 h-44 w-44 rounded-full bg-indigo-300/35 blur-3xl"
        animate={{ x: [0, 8, 0], y: [0, -10, 0] }}
        transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[18%] top-[22%] h-36 w-36 rounded-full bg-fuchsia-300/30 blur-3xl"
        animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
        transition={{ duration: 12.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 -right-14 h-52 w-52 rounded-full bg-emerald-300/24 blur-3xl"
        animate={{ x: [0, -6, 0], y: [0, 10, 0] }}
        transition={{ duration: 13.2, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
      />

      <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div className="max-w-xl space-y-5" variants={itemVariants}>
          <motion.p
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85"
            variants={itemVariants}
          >
            AI-FIRST FINTECH PLATFORM
          </motion.p>
          <motion.h1
            className="font-display text-5xl font-semibold leading-none md:text-6xl"
            variants={itemVariants}
          >
            Aarvika
          </motion.h1>
          <motion.p className="text-base font-medium text-white/95 md:text-lg" variants={itemVariants}>
            She who grows wealth with wisdom.
          </motion.p>
          <motion.p className="text-sm text-white/90 md:text-base" variants={itemVariants}>
            Build confidence with guided budgeting, simple investing simulations, and AI-powered financial insights designed for long-term growth.
          </motion.p>

          <motion.div className="flex flex-wrap gap-3 pt-2" variants={itemVariants}>
            <MotionLink
              to="/signup"
              className="btn-hero-primary"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
            >
              Get Started Free
            </MotionLink>
            <MotionLink
              to="/dashboard"
              className="btn-hero-secondary"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              Explore Dashboard
            </MotionLink>
          </motion.div>

          <motion.div className="flex flex-wrap gap-5 pt-3 text-xs text-white/90 md:text-sm" variants={itemVariants}>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Growth-focused learning
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              Wealth planning made simple
            </span>
          </motion.div>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-[360px]" variants={itemVariants}>
          <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-white/20 blur-3xl" />
          <motion.div
            className="relative overflow-hidden rounded-[24px] border border-white/35 bg-white/12 p-7 backdrop-blur-xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="absolute -right-9 -top-10 h-32 w-32 rounded-full bg-fuchsia-200/35 blur-2xl" />
            <div className="absolute -bottom-8 -left-10 h-32 w-32 rounded-full bg-indigo-200/28 blur-2xl" />

            <div className="relative flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center rounded-[22px] border border-white/45 bg-white/85 p-5 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.75)]">
                <LotusLogo className="h-24 w-24 md:h-28 md:w-28" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">Aarvika Intelligence</h3>
              <p className="mt-2 text-sm text-white/88">
                Personal finance guidance that balances confidence, discipline, and smart growth habits.
              </p>
              <div className="mt-5 grid w-full grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">
                  <div className="font-semibold text-[#10B981]">+14%</div>
                  <div className="text-white/80">Growth readiness</div>
                </div>
                <div className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">
                  <div className="font-semibold text-[#F59E0B]">5 min</div>
                  <div className="text-white/80">Daily finance check-in</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
