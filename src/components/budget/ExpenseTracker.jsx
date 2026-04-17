import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { supabase } from "../../supabase/client";

const CATEGORY_OPTIONS = [
  "Groceries",
  "Rent",
  "Utilities",
  "Education",
  "Health",
  "Transportation",
  "Other"
];

const COLORS = ["#4338CA", "#EF4444", "#F59E0B", "#10B981", "#A78BFA", "#38BDF8", "#94A3B8"];

const normalizeBudgetExpenses = (rawExpenses) => {
  const source = (() => {
    if (Array.isArray(rawExpenses)) {
      return rawExpenses;
    }

    if (typeof rawExpenses === "string") {
      try {
        const parsed = JSON.parse(rawExpenses);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  })();

  return source.map((item, index) => ({
    id: item?.id || `expense-${index}`,
    amount: Number(item?.amount || 0),
    category:
      typeof item?.category === "string" && item.category.trim()
        ? item.category.trim()
        : "Other",
    date:
      typeof item?.date === "string" && item.date.trim()
        ? item.date
        : new Date().toISOString().slice(0, 10),
    note: typeof item?.note === "string" ? item.note : ""
  }));
};

export const ExpenseTracker = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const fetchLatestBudget = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Failed to fetch latest budget:", error);
        }
        setLoading(false);
        return;
      }

      if (data) {
        const parsedIncome = Number(data.income || 0);
        setIncome(Number.isFinite(parsedIncome) ? parsedIncome : 0);
        setExpenses(normalizeBudgetExpenses(data.expenses));
      }

      setLoading(false);
    };

    fetchLatestBudget();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || !category) {
      return;
    }
    const expensePayload = {
      amount: numericAmount,
      category,
      date: date || new Date().toISOString().slice(0, 10),
      note: note.trim() || null
    };

    const newExpense = {
      id: Date.now(),
      ...expensePayload
    };

    const nextExpenses = [newExpense, ...expenses];
    setExpenses(nextExpenses);

    if (supabase) {
      const { error } = await supabase.from("budgets").insert([
        {
          income,
          expenses: nextExpenses
        }
      ]);

      if (error) {
        console.error("Failed to save budget snapshot:", error);
      }
    }

    setAmount("");
    setCategory("");
    setDate("");
    setNote("");
  };

  const categoryData = useMemo(() => {
    const map = new Map();
    expenses.forEach((exp) => {
      map.set(exp.category, (map.get(exp.category) || 0) + exp.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      {/* Add expense form */}
      <section className="surface-panel space-y-3 p-6">
        <h2 className="text-sm font-semibold text-brand-blue">Add an expense</h2>
        <form onSubmit={handleAdd} className="space-y-2 text-sm">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="">Category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="btn-primary w-full text-sm mt-1">
            Add expense
          </button>
          <p className="text-[11px] text-brand-blue/60 mt-1">
            This is a local demo tracker. In the full version, expenses will be saved to
            your account.
          </p>
        </form>
      </section>

      {/* List + pie chart */}
      <section className="surface-panel space-y-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-brand-blue">Your expenses</h2>
            <p className="text-xs text-brand-blue/60">
              Recent expenses and a quick view of where your money is going.
            </p>
          </div>
          <div className="text-xs text-brand-blue/70">
            Total: ₹{total.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-center">
          <div className="max-h-60 overflow-y-auto pr-1">
            {loading ? (
              <div className="border border-dashed border-primary-purple/20 rounded-xl p-4 text-xs text-brand-blue/50 text-center">
                Loading expenses...
              </div>
            ) : expenses.length === 0 ? (
              <div className="border border-dashed border-primary-purple/20 rounded-xl p-4 text-xs text-brand-blue/50 text-center">
                No expenses yet. Add your first expense to see your list and category
                breakdown.
              </div>
            ) : (
              <ul className="space-y-2 text-xs">
                {expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="surface-card flex items-center justify-between gap-2 rounded-xl px-3 py-2"
                  >
                    <div>
                      <div className="font-medium text-brand-blue">
                        ₹{exp.amount.toLocaleString("en-IN")}{" "}
                        <span className="text-[11px] text-brand-blue/60">
                          · {exp.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-brand-blue/60">
                        {exp.date} {exp.note ? `· ${exp.note}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="h-40">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[11px] text-brand-blue/50 text-center px-4">
                Category chart will appear here once you add a few expenses.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

