import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

type CreateWagerModalProps = {
  onClose: () => void;
};

export function CreateWagerModal({ onClose }: CreateWagerModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeInput, setStakeInput] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createWager = useMutation(api.wagers.createWager);
  const tagOptions = useQuery(api.queries.getTagOptions) ?? [];
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStakeInput("");
    setCloseDate("");
    setSelectedTag("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="Close create wager"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              New wager
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Start a friendly bet
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>
        <form
          className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (isSubmitting) {
              return;
            }
            setIsSubmitting(true);
            const parsedStake = Number.parseFloat(stakeInput || "0");
            const closesAt = closeDate
              ? (() => {
                  const [year, month, day] = closeDate
                    .split("-")
                    .map((value) => Number(value));
                  return new Date(year, month - 1, day).getTime();
                })()
              : undefined;
            const tags = selectedTag ? [selectedTag] : undefined;
            try {
              await createWager({
                title: title.trim(),
                description: description.trim(),
                totalCred: Number.isNaN(parsedStake) ? 0 : parsedStake,
                closesAt,
                tags,
              });
              resetForm();
              onClose();
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="block text-sm font-semibold text-slate-700">
            Wager title
            <input
              type="text"
              placeholder="e.g. What day will we ship the launch?"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Description
            <textarea
              rows={4}
              placeholder="Add the stakes and the expectations so everyone is aligned."
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Stake (work cred)
              <input
                type="number"
                min={1}
                placeholder="50"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={stakeInput}
                onChange={(event) => setStakeInput(event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Close date
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={closeDate}
                onChange={(event) => setCloseDate(event.target.value)}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Tag
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              disabled={tagOptions.length === 0}
            >
              <option value="">Select a tag</option>
              {tagOptions.map((tag) => (
                <option key={tag.id} value={tag.label}>
                  {tag.label}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            This wager will be open to everyone in your workplace.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Everyone will get a notification once you open the wager.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create wager"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
