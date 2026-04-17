import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const InvestmentSummary = ({ projectionData }) => {
  const startValue = projectionData[0]?.value ?? 0;
  const endValue = projectionData[projectionData.length - 1]?.value ?? 0;
  const growthPercent = startValue ? Math.round(((endValue - startValue) / startValue) * 100) : 0;

  return (
    <motion.section
      className="surface-card p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-display text-lg text-brand-blue">Investment Simulator</h2>
          <p className="text-xs text-brand-blue/65">Projected growth based on your current simulation strategy.</p>
        </div>
        <p className="rounded-full bg-primary-purple/10 px-3 py-1 text-xs font-semibold text-primary-purple">
          +{growthPercent}%
        </p>
      </div>

      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9DFF3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
            <YAxis
              axisLine={false}
              tickLine={false}
              fontSize={11}
              tickFormatter={(value) => `INR ${Math.round(value / 1000)}k`}
            />
            <Tooltip formatter={(value) => `INR ${value.toLocaleString("en-IN")}`} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4338CA"
              strokeWidth={3}
              dot={{ r: 3, fill: "#A78BFA" }}
              activeDot={{ r: 5, fill: "#4338CA" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};
