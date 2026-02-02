import { AdminPanel } from "./components/AdminPanel.jsx";
import { UserProfile } from "./components/UserProfile.jsx";
import { WagerBoard } from "./components/WagerBoard.jsx";
import { profile } from "./data/profile.js";
import { users } from "./data/users.js";
import { wagers } from "./data/wagers.js";

const navigation = [
  { label: "Board", active: true },
  { label: "Profile" },
  { label: "Admin" },
  { label: "Settings" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-cloud">
      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-semibold text-white">
              WB
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Work Bets</p>
              <p className="text-xs text-slate-500">
                Friendly workplace wagers
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`transition hover:text-slate-900 ${
                  item.active ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Menu
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        <section className="rounded-3xl bg-gradient-to-r from-lavender via-white to-sky p-8 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                Core experience
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                Make friendly wagers, celebrate the wins.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600">
                Every team member gets one free vote, with optional work cred
                enhancements capped at half the pool. Close wagers to reveal a
                winner and distribute payouts instantly.
              </p>
            </div>
            <div className="grid gap-3 rounded-3xl bg-white/80 p-5 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Open wagers</span>
                <span className="font-semibold text-slate-900">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active workplaces</span>
                <span className="font-semibold text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Work cred in play</span>
                <span className="font-semibold text-slate-900">214</span>
              </div>
            </div>
          </div>
        </section>

        <WagerBoard wagers={wagers} />

        <section className="grid gap-6 lg:grid-cols-2">
          <UserProfile profile={profile} />
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Wager Details</p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Market pulse
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Open
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Enhancements are capped at 50% of total work cred when the vote
                is placed. Winners split the pooled cred.
              </p>
              <div className="mt-6 space-y-3">
                {wagers[0].options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      index === 0
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {option}
                    <span className="text-xs text-slate-400">Vote</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Enhance vote</span>
                  <span className="font-semibold text-slate-900">+6 cred</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 w-2/3 rounded-full bg-indigo-400" />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Max enhancement 12 cred
                </p>
              </div>
            </section>
            <AdminPanel users={users} />
          </div>
        </section>
      </main>
    </div>
  );
}
