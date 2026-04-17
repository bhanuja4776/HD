import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { FinancialCards } from "../components/dashboard/FinancialCards";
import { ExpenseChart } from "../components/dashboard/ExpenseChart";
import { SavingsTracker } from "../components/dashboard/SavingsTracker";
import { RecentExpenses } from "../components/dashboard/RecentExpenses";
import { InvestmentSummary } from "../components/dashboard/InvestmentSummary";
import { AISuggestions } from "../components/dashboard/AISuggestions";
import { StockPrice } from "../components/StockPrice";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getUserProfile } from "../lib/userProfiles";

const SAMPLE_MONTHLY_INCOME = 62000;
const SAMPLE_SAVINGS_GOAL = 50000;

const SAMPLE_EXPENSE_ROWS = [
  { id: "sample-exp-1", amount: 680, category: "Food", date: "2026-03-08" },
  { id: "sample-exp-2", amount: 240, category: "Transport", date: "2026-03-07" },
  { id: "sample-exp-3", amount: 1890, category: "Shopping", date: "2026-03-06" },
  { id: "sample-exp-4", amount: 1450, category: "Bills", date: "2026-03-05" },
  { id: "sample-exp-5", amount: 5200, category: "Savings", date: "2026-03-04" },
  { id: "sample-exp-6", amount: 1180, category: "Food", date: "2026-03-03" },
  { id: "sample-exp-7", amount: 6900, category: "Bills", date: "2026-03-02" },
  { id: "sample-exp-8", amount: 2760, category: "Transport", date: "2026-03-01" }
];

const SAMPLE_INVESTMENT_SERIES = [
  { month: "Jan", value: 50000 },
  { month: "Feb", value: 51800 },
  { month: "Mar", value: 54200 },
  { month: "Apr", value: 56300 },
  { month: "May", value: 59100 },
  { month: "Jun", value: 62100 }
];

const INVESTMENT_VALUE_KEYS = [
  "projected_value",
  "current_value",
  "portfolio_value",
  "value",
  "future_value"
];

const parseDateSafe = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDateLabel = (value, fallbackIndex = 0) => {
  const parsed = parseDateSafe(value);
  if (!parsed) {
    return `Entry ${fallbackIndex + 1}`;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const formatMonthLabel = (value, fallbackIndex = 0) => {
  const parsed = parseDateSafe(value);
  if (!parsed) {
    return `M${fallbackIndex + 1}`;
  }

  return parsed.toLocaleDateString("en-IN", { month: "short" });
};

const formatCurrency = (value) => `INR ${Math.round(value).toLocaleString("en-IN")}`;

const toTitleCase = (value) => {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const getDisplayName = (user) => {
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  if (typeof user?.email === "string" && user.email.includes("@")) {
    return toTitleCase(user.email.split("@")[0]);
  }

  return "Aarvika User";
};

const normalizeExpenseRows = (rows) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row, index) => {
      const amount = Number(row?.amount || 0);
      const category = typeof row?.category === "string" && row.category.trim()
        ? row.category.trim()
        : "Other";

      return {
        id: row?.id || `expense-${index}`,
        amount,
        category,
        date: row?.date || row?.created_at || new Date().toISOString()
      };
    })
    .filter((item) => Number.isFinite(item.amount) && item.amount > 0);
};

const buildExpenseBreakdown = (rows) => {
  const totals = new Map();

  rows.forEach((item) => {
    totals.set(item.category, (totals.get(item.category) || 0) + item.amount);
  });

  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const buildRecentExpenses = (rows) => {
  return [...rows]
    .sort((a, b) => {
      const dateA = parseDateSafe(a.date)?.getTime() || 0;
      const dateB = parseDateSafe(b.date)?.getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, 5)
    .map((item, index) => ({
      date: formatDateLabel(item.date, index),
      category: item.category,
      amount: item.amount
    }));
};

const getInvestmentValue = (row) => {
  for (const key of INVESTMENT_VALUE_KEYS) {
    const numericValue = Number(row?.[key]);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue;
    }
  }

  const fallbackAmount = Number(row?.amount ?? row?.invested_amount ?? row?.principal ?? 0);
  return Number.isFinite(fallbackAmount) ? fallbackAmount : 0;
};

const buildInvestmentSeries = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const sortedRows = [...rows].sort((a, b) => {
    const dateA = parseDateSafe(a?.date || a?.created_at)?.getTime() || 0;
    const dateB = parseDateSafe(b?.date || b?.created_at)?.getTime() || 0;
    return dateA - dateB;
  });

  const hasExplicitValue = sortedRows.some((row) =>
    INVESTMENT_VALUE_KEYS.some((key) => Number.isFinite(Number(row?.[key])) && Number(row?.[key]) > 0)
  );

  let runningTotal = 0;

  const points = sortedRows
    .map((row, index) => {
      const month = formatMonthLabel(row?.date || row?.created_at, index);

      if (hasExplicitValue) {
        return {
          month,
          value: Math.max(getInvestmentValue(row), 0)
        };
      }

      runningTotal += Math.max(getInvestmentValue(row), 0);
      return {
        month,
        value: runningTotal
      };
    })
    .filter((item) => item.value > 0);

  return points;
};

export const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const userName = getDisplayName(user);

  const [dashboardData, setDashboardData] = useState({
    loading: true,
    monthlyIncome: SAMPLE_MONTHLY_INCOME,
    expenseRows: SAMPLE_EXPENSE_ROWS,
    investmentSeries: SAMPLE_INVESTMENT_SERIES,
    usingSampleExpenses: true,
    usingSampleInvestments: true
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.id || !supabase) {
        if (isMounted) {
          setDashboardData({
            loading: false,
            monthlyIncome: SAMPLE_MONTHLY_INCOME,
            expenseRows: SAMPLE_EXPENSE_ROWS,
            investmentSeries: SAMPLE_INVESTMENT_SERIES,
            usingSampleExpenses: true,
            usingSampleInvestments: true
          });
        }
        return;
      }

      const [expensesResult, investmentsResult, profileResult] = await Promise.all([
        supabase
          .from("expenses")
          .select("id, amount, category, date, created_at")
          .eq("user_id", user.id),
        supabase.from("investments").select("*").eq("user_id", user.id).limit(36),
        getUserProfile(user.id)
      ]);

      if (expensesResult.error) {
        console.error("Failed to load expenses for dashboard:", expensesResult.error);
      }

      if (investmentsResult.error) {
        console.warn("Could not load investments table for dashboard, using fallback data:", investmentsResult.error.message);
      }

      if (profileResult?.error) {
        console.error("Failed to load profile for dashboard:", profileResult.error);
      }

      const normalizedExpenses = normalizeExpenseRows(expensesResult.data || []);
      const normalizedInvestments = buildInvestmentSeries(investmentsResult.data || []);

      const profileIncome = Number(profileResult?.data?.monthly_income || 0);
      const monthlyIncome = Number.isFinite(profileIncome) && profileIncome > 0
        ? profileIncome
        : SAMPLE_MONTHLY_INCOME;

      if (!isMounted) {
        return;
      }

      setDashboardData({
        loading: false,
        monthlyIncome,
        // Use real table data when available, otherwise keep dashboard populated with placeholders.
        expenseRows: normalizedExpenses.length > 0 ? normalizedExpenses : SAMPLE_EXPENSE_ROWS,
        investmentSeries:
          normalizedInvestments.length > 0 ? normalizedInvestments : SAMPLE_INVESTMENT_SERIES,
        usingSampleExpenses: normalizedExpenses.length === 0,
        usingSampleInvestments: normalizedInvestments.length === 0
      });
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.id]);

  const expenseBreakdown = useMemo(
    () => buildExpenseBreakdown(dashboardData.expenseRows),
    [dashboardData.expenseRows]
  );

  const recentExpenses = useMemo(
    () => buildRecentExpenses(dashboardData.expenseRows),
    [dashboardData.expenseRows]
  );

  const monthlySpending = useMemo(() => {
    // Treat "Savings" category as planned allocation, not discretionary spending.
    return dashboardData.expenseRows
      .filter((item) => item.category.toLowerCase() !== "savings")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [dashboardData.expenseRows]);

  const savedAmount = useMemo(() => {
    return dashboardData.expenseRows
      .filter((item) => item.category.toLowerCase() === "savings")
      .reduce((sum, item) => sum + item.amount, 0);
  }, [dashboardData.expenseRows]);

  const budgetRemaining = dashboardData.monthlyIncome - monthlySpending;

  const lastInvestmentValue =
    dashboardData.investmentSeries[dashboardData.investmentSeries.length - 1]?.value || 0;
  const firstInvestmentValue = dashboardData.investmentSeries[0]?.value || 0;
  const investmentGrowthPercent = firstInvestmentValue
    ? Math.round(((lastInvestmentValue - firstInvestmentValue) / firstInvestmentValue) * 100)
    : 0;

  const totalSavings = Math.max(savedAmount + Math.max(budgetRemaining, 0) + lastInvestmentValue, 0);

  const savingsGoalAmount = Math.max(
    SAMPLE_SAVINGS_GOAL,
    Math.round((dashboardData.monthlyIncome * 1.15) / 1000) * 1000
  );
  const savedTowardGoal = Math.min(totalSavings, savingsGoalAmount);

  const aiSuggestionMessage =
    budgetRemaining < 0
      ? "AI Aarvika noticed your monthly spending is above income. Try reducing shopping by 10% and shifting that amount to bills first, then savings."
      : savedAmount < dashboardData.monthlyIncome * 0.2
      ? "AI Aarvika suggests increasing your monthly savings allocation to at least 20% of income to improve long-term financial resilience."
      : "AI Aarvika suggests moving a small amount from discretionary categories into a recurring SIP to accelerate your long-term wealth goal.";

  const financialCards = [
    {
      title: "Total Savings",
      value: formatCurrency(totalSavings),
      change: dashboardData.usingSampleExpenses
        ? "Using sample savings baseline"
        : "Calculated from your savings + investments",
      description: "Includes savings category, remaining budget, and latest investment value.",
      tone: "savings"
    },
    {
      title: "Monthly Spending",
      value: formatCurrency(monthlySpending),
      change: dashboardData.usingSampleExpenses
        ? "Using sample expense data"
        : "Computed from your expenses table",
      description: "Total non-savings spending recorded for this period.",
      tone: "spending"
    },
    {
      title: "Budget Remaining",
      value: formatCurrency(budgetRemaining),
      change: budgetRemaining >= 0 ? "Within planned budget" : "Over budget this month",
      description: "Monthly income minus non-savings spending.",
      tone: "remaining"
    },
    {
      title: "Investment Growth",
      value: `${investmentGrowthPercent >= 0 ? "+" : ""}${investmentGrowthPercent}%`,
      change: dashboardData.usingSampleInvestments
        ? "Using sample projection trend"
        : "Derived from your investments table",
      description: "Growth from first to latest investment data point.",
      tone: "growth"
    }
  ];

  if (authLoading || dashboardData.loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-3xl border border-primary-purple/10 bg-white dark:border-primary-violet/28 dark:bg-slate-900/72" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-40 animate-pulse rounded-2xl border border-primary-purple/10 bg-white dark:border-primary-violet/28 dark:bg-slate-900/72" />
          <div className="h-40 animate-pulse rounded-2xl border border-primary-purple/10 bg-white dark:border-primary-violet/28 dark:bg-slate-900/72" />
          <div className="h-40 animate-pulse rounded-2xl border border-primary-purple/10 bg-white dark:border-primary-violet/28 dark:bg-slate-900/72" />
          <div className="h-40 animate-pulse rounded-2xl border border-primary-purple/10 bg-white dark:border-primary-violet/28 dark:bg-slate-900/72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12">
      <DashboardHeader userName={userName} />

      {(dashboardData.usingSampleExpenses || dashboardData.usingSampleInvestments) && (
        <div className="rounded-2xl border border-primary-gold/40 bg-primary-gold/12 px-4 py-3 text-xs text-brand-blue/75 dark:border-primary-gold/35 dark:bg-primary-gold/15">
          Live dashboard data is partially unavailable right now. Showing sample placeholders while the Supabase tables are empty or missing.
        </div>
      )}

      <FinancialCards cards={financialCards} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-2xl text-slate-800 dark:text-slate-200">
            Live Market Prices
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Auto-refreshes every 15 seconds
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StockPrice symbol="AAPL" />
          <StockPrice symbol="TSLA" />
          <StockPrice symbol="GOOGL" />
          <StockPrice symbol="NVDA" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <ExpenseChart data={expenseBreakdown} />
        <SavingsTracker goalAmount={savingsGoalAmount} savedAmount={savedTowardGoal} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <RecentExpenses expenses={recentExpenses} />

        <div className="space-y-6">
          <InvestmentSummary projectionData={dashboardData.investmentSeries} />
          <AISuggestions message={aiSuggestionMessage} />
        </div>
      </div>
    </div>
  );
};
