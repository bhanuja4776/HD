import { motion } from "framer-motion";

export const RecentExpenses = ({ expenses }) => {
  return (
    <motion.section
      className="surface-card p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-1">
        <h2 className="font-display text-lg text-brand-blue">Recent Expenses</h2>
        <p className="text-xs text-brand-blue/65">Your latest spending activity this month.</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-primary-purple/10 text-xs uppercase tracking-[0.08em] text-brand-blue/55">
              <th className="py-2 pr-3 font-semibold">Date</th>
              <th className="py-2 pr-3 font-semibold">Category</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => (
              <motion.tr
                key={`${item.date}-${item.category}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="border-b border-primary-purple/5 last:border-none"
              >
                <td className="py-3 pr-3 text-brand-blue/75">{item.date}</td>
                <td className="py-3 pr-3 text-brand-blue">{item.category}</td>
                <td className="py-3 text-right font-semibold text-brand-blue">
                  INR {item.amount.toLocaleString("en-IN")}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};
