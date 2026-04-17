import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RATES = {
  "Fixed deposit": 0.07,
  "Mutual fund": 0.12,
  Gold: 0.09,
  "Savings account": 0.035
};

const DURATIONS = [
  { label: "1 year", value: 1 },
  { label: "3 years", value: 3 },
  { label: "5 years", value: 5 }
];

export const InvestmentSimulator = () => {
  const [amount, setAmount] = useState(10000);
  const [type, setType] = useState("Mutual fund");
  const [duration, setDuration] = useState(3);

  const { projectedValue, data } = useMemo(() => {
    const rate = RATES[type] ?? 0.08;
    const years = duration || 1;
    const points = [];
    for (let year = 0; year <= years; year += 1) {
      const value = Math.round(amount * Math.pow(1 + rate, year));
      points.push({ year: `Y${year}`, value });
    }
    const finalValue = points[points.length - 1]?.value ?? amount;
    return { projectedValue: finalValue, data: points };
  }, [amount, type, duration]);

  const projectedGain = projectedValue - amount;

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* Inputs */}
      <section className="surface-panel space-y-3 p-6">
        <h2 className="text-sm font-semibold text-brand-blue">
          Quick investment simulation
        </h2>
        <p className="text-xs text-brand-blue/60">
          Try a simple &quot;what if&quot; scenario with virtual money. This doesn&apos;t
          use real market data, but helps you build intuition.
        </p>
        <div className="space-y-2 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-blue/80">
              Investment amount (₹)
            </label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="input-field"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-blue/80">
              Investment type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
            >
              <option>Fixed deposit</option>
              <option>Mutual fund</option>
              <option>Gold</option>
              <option>Savings account</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-blue/80">Duration</label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-xs ${
                    duration === d.value
                      ? "border-primary-purple bg-primary-purple text-white"
                      : "border-primary-purple/20 bg-white text-brand-blue hover:bg-primary-purple/5"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-brand-dark text-white px-4 py-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Projected value</span>
            <span className="font-semibold">
              ₹{projectedValue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Projected gain</span>
            <span>
              ₹{projectedGain.toLocaleString("en-IN")} ({duration} year
              {duration > 1 ? "s" : ""})
            </span>
          </div>
          <p className="text-[11px] text-white/70 mt-1">
            These numbers are for learning only and are not financial advice.
          </p>
        </div>
      </section>

      {/* Chart */}
      <section className="surface-panel space-y-3 p-6">
        <h2 className="text-sm font-semibold text-brand-blue">Growth chart</h2>
        <p className="text-xs text-brand-blue/60">
          See how your simulated investment could grow over the selected duration.
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="year" axisLine={false} tickLine={false} fontSize={11} />
              <YAxis
                axisLine={false}
                tickLine={false}
                fontSize={11}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4338CA"
                strokeWidth={2}
                dot={{ r: 3, fill: "#A78BFA" }}
                activeDot={{ r: 4, fill: "#4338CA" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

