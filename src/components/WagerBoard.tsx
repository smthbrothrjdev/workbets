import type { Wager } from "../types";
import { WagerCard } from "./WagerCard";

type WagerBoardProps = {
  wagers: Wager[];
};

export function WagerBoard({ wagers }: WagerBoardProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Wager Board
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            What are we betting on today?
          </h2>
        </div>
        <button
          type="button"
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-400"
        >
          + Create wager
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {wagers.map((wager) => (
          <WagerCard key={wager.id} wager={wager} />
        ))}
      </div>
    </section>
  );
}
