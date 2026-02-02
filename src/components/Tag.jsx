import PropTypes from "prop-types";

const tagStyles = {
  Open: "bg-mint text-emerald-900",
  Closed: "bg-slate-200 text-slate-700",
  Trending: "bg-lavender text-indigo-900",
  "Low risk": "bg-sky text-sky-900",
  "Popular pick": "bg-peach text-orange-900",
  Completed: "bg-slate-200 text-slate-700",
};

export function Tag({ label }) {
  const classes = tagStyles[label] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
};
