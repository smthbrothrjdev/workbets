import { useState } from "react";

import type { Wager } from "../types";
import { CreateWagerModal } from "./CreateWagerModal";
import { WagerCard } from "./WagerCard";

type WagerBoardProps = {
  wagers: Wager[];
  currentUserId?: string | null;
  isAdmin?: boolean;
};

export function WagerBoard({
  wagers,
  currentUserId,
  isAdmin = false,
}: WagerBoardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
          onClick={() => setIsCreateOpen(true)}
        >
          + Create wager
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {wagers.map((wager) => (
          <WagerCard
            key={wager.id}
            wager={wager}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      {isCreateOpen ? (
        <CreateWagerModal
          createdBy={currentUserId}
          onClose={() => setIsCreateOpen(false)}
        />
      ) : null}
    </section>
  );
}
