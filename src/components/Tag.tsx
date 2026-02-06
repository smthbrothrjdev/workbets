const tagStyles: Record<string, string> = {
  Open: "bg-mint text-emerald-900",
  Closed: "bg-slate-200 text-slate-700",
  Trending: "bg-lavender text-indigo-900",
  "Low risk": "bg-sky text-sky-900",
  Completed: "bg-slate-200 text-slate-700",
};

type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  const classes = tagStyles[label] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
