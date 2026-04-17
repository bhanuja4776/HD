import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const EXPENSE_COLORS = ["#4338CA", "#EF4444", "#F59E0B", "#10B981", "#A78BFA"];

export const ExpenseChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.section
      className="surface-card p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-1">
        <h2 className="font-display text-lg text-brand-blue">Expense Breakdown</h2>
        <p className="text-xs text-brand-blue/65">
          Monthly allocation across your core spending and saving categories.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={78}
                stroke="none"
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `INR ${value.toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = total ? Math.round((item.value / total) * 100) : 0;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-primary-purple/12 bg-brand-background/75 px-3 py-2"
              >
                <span className="inline-flex items-center gap-2 text-xs text-brand-blue/75">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="text-xs font-semibold text-brand-blue">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
