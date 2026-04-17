import { ExpenseTracker } from "../components/budget/ExpenseTracker";

export const BudgetPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-blue md:text-3xl">Budget & expenses</h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Capture your income and day-to-day spending so Aarvika can highlight savings
          opportunities.
        </p>
      </div>

      <ExpenseTracker />
    </div>
  );
};


