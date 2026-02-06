import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Wager } from "../types";
import { Tag } from "./Tag";

type WagerCardProps = {
  wager: Wager;
  currentUserId?: string | null;
  isAdmin?: boolean;
};

const statusLabels = {
  closed: "Closed",
  cancelled: "Cancelled",
} as const;

export function WagerCard({
  wager,
  currentUserId,
  isAdmin = false,
}: WagerCardProps) {
  const closeWager = useMutation(api.wagers.closeWager);
  const cancelWager = useMutation(api.wagers.cancelWager);
  const deleteWager = useMutation(api.wagers.deleteWager);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const canManage = Boolean(
    currentUserId && (isAdmin || wager.createdBy === currentUserId)
  );
  const isOpen = wager.status === "Open";
  const winnerOptionId = wager.winnerOptionId ?? null;
  const winningLabel = useMemo(() => {
    if (!winnerOptionId) {
      return null;
    }
    return (
      wager.votes.find((vote) => vote.optionId === winnerOptionId)?.option ??
      null
    );
  }, [winnerOptionId, wager.votes]);

  useEffect(() => {
    if (isCloseModalOpen) {
      setSelectedWinner(wager.votes[0]?.optionId ?? "");
    }
  }, [isCloseModalOpen, wager.votes]);

  const handleCloseWager = async () => {
    if (!currentUserId || !selectedWinner) {
      return;
    }
    await closeWager({
      wagerId: wager.id,
      userId: currentUserId,
      winnerOptionId: selectedWinner,
    });
    setIsCloseModalOpen(false);
  };

  const handleCancelWager = async () => {
    if (!currentUserId) {
      return;
    }
    await cancelWager({ wagerId: wager.id, userId: currentUserId });
    setIsCancelModalOpen(false);
  };

  const handleDeleteWager = async () => {
    if (!currentUserId) {
      return;
    }
    await deleteWager({ wagerId: wager.id, userId: currentUserId });
    setIsDeleteModalOpen(false);
  };

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-soft">
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Tag label={wager.status} />
            {wager.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          {canManage ? (
            <div className="relative">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                ⋯
              </button>
              {isMenuOpen ? (
                <div className="absolute right-0 z-10 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-soft">
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    disabled={!isOpen}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCloseModalOpen(true);
                    }}
                  >
                    Close wager
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    disabled={!isOpen}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCancelModalOpen(true);
                    }}
                  >
                    Cancel wager
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete wager
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{wager.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{wager.description}</p>
        </div>
        <div className="space-y-3">
          {wager.votes.map((vote) => (
            <div
              key={vote.option}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                vote.optionId === winnerOptionId
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "bg-slate-50 text-slate-700"
              }`}
            >
              <span className="font-medium">{vote.option}</span>
              <span
                className={
                  vote.optionId === winnerOptionId
                    ? "text-emerald-700"
                    : "text-slate-500"
                }
              >
                {vote.percent}% chose this
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{wager.totalCred} work cred pooled</span>
          {winningLabel ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Winner: {winningLabel}
            </span>
          ) : (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Potential payout 1.6x
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isOpen
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
            type="button"
            disabled={!isOpen}
          >
            {isOpen ? "Vote" : "Voting closed"}
          </button>
          <button
            className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              isOpen
                ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            }`}
            type="button"
            disabled={!isOpen}
          >
            Enhance +
          </button>
        </div>
      </div>
      {isCloseModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
          <button
            type="button"
            aria-label="Close close wager"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsCloseModalOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                  Close wager
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Select the winning option
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                onClick={() => setIsCloseModalOpen(false)}
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
            <div className="space-y-3 px-6 py-6">
              {wager.votes.map((vote) => (
                <label
                  key={vote.optionId}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name={`winner-${wager.id}`}
                    className="h-4 w-4 text-indigo-500"
                    value={vote.optionId}
                    checked={selectedWinner === vote.optionId}
                    onChange={() => setSelectedWinner(vote.optionId)}
                  />
                  <span className="font-medium">{vote.option}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Closing ends voting and announces the winner.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  onClick={() => setIsCloseModalOpen(false)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-200"
                  disabled={!selectedWinner}
                  onClick={handleCloseWager}
                >
                  Close wager
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isCancelModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
          <button
            type="button"
            aria-label="Close cancel wager"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsCancelModalOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                  {statusLabels.cancelled}
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Cancel this wager?
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                onClick={() => setIsCancelModalOpen(false)}
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
            <div className="space-y-2 px-6 py-6 text-sm text-slate-600">
              <p>Canceling ends voting without selecting a winner.</p>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                onClick={handleCancelWager}
              >
                Cancel wager
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
          <button
            type="button"
            aria-label="Close delete wager"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">
                  Delete wager
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Remove this wager?
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
            <div className="space-y-2 px-6 py-6 text-sm text-slate-600">
              <p>Deleting removes the wager from the board permanently.</p>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                onClick={handleDeleteWager}
              >
                Delete wager
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
