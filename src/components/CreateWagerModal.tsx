import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

type CreateWagerModalProps = {
  createdBy: string;
  onClose: () => void;
};

type OptionsModalProps = {
  options: string[];
  onSave: (options: string[]) => void;
  onClose: () => void;
};

function OptionsModal({ options, onSave, onClose }: OptionsModalProps) {
  const [draftOptions, setDraftOptions] = useState<string[]>(
    options.length > 0 ? options : [""]
  );

  const updateOption = (index: number, value: string) => {
    setDraftOptions((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const removeOption = (index: number) => {
    setDraftOptions((current) =>
      current.length > 1 ? current.filter((_, i) => i !== index) : [""]
    );
  };

  const addOption = () => {
    setDraftOptions((current) => [...current, ""]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label="Close options"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
              Voting options
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Set the options
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
        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-6">
          {draftOptions.map((option, index) => (
            <div key={`option-${index}`} className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Option {index + 1}
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter an option"
                  value={option}
                  onChange={(event) => updateOption(index, event.target.value)}
                />
              </div>
              <button
                type="button"
                className="mt-6 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                onClick={() => removeOption(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-2xl border border-dashed border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-500"
            onClick={addOption}
          >
            + Add option
          </button>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Add at least two options for teammates to vote on.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-400"
              onClick={() => onSave(draftOptions)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateWagerModal({
  createdBy,
  onClose,
}: CreateWagerModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeInput, setStakeInput] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [voteOptions, setVoteOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createWager = useMutation(api.wagers.createWager);
  const tagOptions = useQuery(api.queries.getTagOptions) ?? [];
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStakeInput("");
    setCloseDate("");
    setTagSearch("");
    setSelectedTags([]);
    setIsTagMenuOpen(false);
    setIsOptionsOpen(false);
    setVoteOptions([]);
  };
  const cleanedOptions = voteOptions
    .map((option) => option.trim())
    .filter(Boolean);
  const isOptionsReady = cleanedOptions.length > 1;
  const filteredTagOptions = tagOptions.filter((tag) =>
    tag.label.toLowerCase().includes(tagSearch.trim().toLowerCase())
  );

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
            if (!createdBy) {
              return;
            }
            if (!isOptionsReady) {
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
            try {
              await createWager({
                title: title.trim(),
                description: description.trim(),
                totalCred: Number.isNaN(parsedStake) ? 0 : parsedStake,
                closesAt,
                options: cleanedOptions,
                tags: selectedTags.length ? selectedTags : undefined,
                createdBy,
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
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Tags
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search tags"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={tagSearch}
                  onChange={(event) => {
                    setTagSearch(event.target.value);
                    setIsTagMenuOpen(true);
                  }}
                  onFocus={() => setIsTagMenuOpen(true)}
                  disabled={tagOptions.length === 0}
                />
                {isTagMenuOpen ? (
                  <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                    {filteredTagOptions.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-500">
                        No matching tags.
                      </p>
                    ) : (
                      <ul className="max-h-44 space-y-1 overflow-y-auto">
                        {filteredTagOptions.map((tag) => {
                          const isSelected = selectedTags.includes(tag.label);
                          return (
                            <li key={tag.id}>
                              <button
                                type="button"
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                                  isSelected
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                                onClick={() => {
                                  setSelectedTags((current) =>
                                    isSelected
                                      ? current.filter(
                                          (label) => label !== tag.label
                                        )
                                      : [...current, tag.label]
                                  );
                                }}
                              >
                                <span>{tag.label}</span>
                                <span className="text-xs">
                                  {isSelected ? "Selected" : "Add"}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <button
                      type="button"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                      onClick={() => setIsTagMenuOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                ) : null}
              </div>
            </label>
            {selectedTags.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    onClick={() =>
                      setSelectedTags((current) =>
                        current.filter((label) => label !== tag)
                      )
                    }
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Choose one or more tags for the wager.
              </p>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">Voting options</p>
              <button
                type="button"
                className="rounded-2xl border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-500"
                onClick={() => setIsOptionsOpen(true)}
              >
                Set options
              </button>
            </div>
            {cleanedOptions.length ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {cleanedOptions.map((option) => (
                  <li
                    key={option}
                    className="rounded-2xl border border-slate-200 px-4 py-2"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-rose-500">
                Add voting options before creating the wager.
              </p>
            )}
          </div>
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
                disabled={isSubmitting || !isOptionsReady}
              >
                {isSubmitting ? "Creating..." : "Create wager"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {isOptionsOpen ? (
        <OptionsModal
          options={voteOptions}
          onClose={() => setIsOptionsOpen(false)}
          onSave={(options) => {
            setVoteOptions(options);
            setIsOptionsOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
