import type { Wager } from "../types";
import { Tag } from "./Tag";

type WagerCardProps = {
  wager: Wager;
};

export function WagerCard({ wager }: WagerCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-soft">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Tag label={wager.status} />
          {wager.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{wager.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{wager.description}</p>
        </div>
        <div className="space-y-3">
          {wager.votes.map((vote) => (
            <div
              key={vote.option}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-medium">{vote.option}</span>
              <span className="text-slate-500">{vote.percent}% chose this</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{wager.totalCred} work cred pooled</span>
          {wager.winner ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Winner: {wager.winner}
            </span>
          ) : (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Potential payout 1.6x
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            type="button"
          >
            Vote
          </button>
          <button
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            type="button"
          >
            Enhance +
          </button>
        </div>
      </div>
    </article>
  );
}
