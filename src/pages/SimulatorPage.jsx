import { InvestmentSimulator } from "../components/simulator/InvestmentSimulator";

export const SimulatorPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-blue md:text-3xl">Investment simulator</h1>
        <p className="text-sm text-brand-blue/70 mt-1">
          Allocate virtual money into a single instrument and see a simple projection of
          how it could grow over time.
        </p>
      </div>
      <InvestmentSimulator />
    </div>
  );
};


