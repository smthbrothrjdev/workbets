import type { UserProfileData } from "../types";

type UserProfileProps = {
  profile: UserProfileData;
};

export function UserProfile({ profile }: UserProfileProps) {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">User Profile</p>
          <h3 className="text-2xl font-semibold text-slate-900">{profile.name}</h3>
          <p className="text-sm text-slate-500">
            {profile.role} • {profile.workplace}
          </p>
        </div>
        <div className="rounded-2xl bg-mint px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-600">
            Work Cred
          </p>
          <p className="text-2xl font-semibold text-emerald-900">
            {profile.workCred}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-700">
            Voting history
          </h4>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            {profile.votingHistory.map((vote) => (
              <li key={vote.id} className="flex justify-between gap-3">
                <span className="font-medium text-slate-700">{vote.title}</span>
                <span className="text-right">
                  {vote.choice}
                  <span className="block text-xs text-slate-400">
                    +{vote.enhanced} enhanced
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-700">
            Points history
          </h4>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            {profile.pointsHistory.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between">
                <span>{entry.label}</span>
                <span
                  className={`font-semibold ${
                    entry.amount > 0 ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {entry.amount > 0 ? `+${entry.amount}` : entry.amount} cred
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
