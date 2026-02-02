import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AdminPanel } from "./components/AdminPanel.jsx";
import { AuthLanding } from "./components/AuthLanding.jsx";
import { UserProfile } from "./components/UserProfile.jsx";
import { WagerBoard } from "./components/WagerBoard.jsx";

const navigation = [
  { label: "Board", active: true },
  { label: "Profile" },
  { label: "Admin" },
  { label: "Settings" },
];

let hasSeededDemoData = false;
const AUTH_STORAGE_KEY = "workbets.authUserId";
const WORKSPACES = [
  { id: "aurora-labs", name: "Aurora Labs" },
  { id: "summit-ops", name: "Summit Ops" },
  { id: "harbor-guild", name: "Harbor Guild" },
];

const CONTROL_CHARACTERS_REGEX = /[\x00-\x1F\x7F]/g;
const ASCII_REGEX = /^[\x20-\x7E]+$/;
const DIGIT_REGEX = /[0-9]/;
const LETTER_REGEX = /[A-Za-z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()]/;
const ASCII_SYMBOL_REGEX = /[\\[\]{};:'",.<>/?`~|\\\-_=+]/;

const sanitizeInput = (value) => value.replace(CONTROL_CHARACTERS_REGEX, "");
const sanitizeEmail = (value) =>
  sanitizeInput(value).replace(/\s+/g, "").toLowerCase();

const getPasswordValidation = (value) => {
  const sanitizedValue = sanitizeInput(value);
  const trimmed = sanitizedValue.trim();

  if (trimmed.length < 5 || trimmed.length > 24) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password must be 5-24 characters long.",
    };
  }

  if (!ASCII_REGEX.test(trimmed)) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password must use standard ASCII characters only.",
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      sanitizedValue,
      message: "Password cannot include spaces.",
    };
  }

  const categories = [
    DIGIT_REGEX.test(trimmed),
    LETTER_REGEX.test(trimmed),
    SPECIAL_CHAR_REGEX.test(trimmed),
    ASCII_SYMBOL_REGEX.test(trimmed),
  ].filter(Boolean).length;

  if (categories < 3) {
    return {
      isValid: false,
      sanitizedValue,
      message:
        "Password must include at least three of: numbers, letters, special characters, or ASCII symbols.",
    };
  }

  return { isValid: true, sanitizedValue, message: null };
};

export default function App() {
  const seedDemoData = useMutation(api.seed.seedDemoData);
  const authenticate = useMutation(api.auth.authenticate);
  const wagers = useQuery(api.queries.getWagers) ?? [];
  const users = useQuery(api.queries.getUsers);
  const userList = users ?? [];
  const [authUserId, setAuthUserId] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEY)
  );
  const [username, setUsername] = useState("riley@workbets.io");
  const [password, setPassword] = useState("workbets123");
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerWorkspace, setRegisterWorkspace] = useState(WORKSPACES[0].id);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const isEmailAuthToken = Boolean(authUserId?.includes("@"));
  const profile = useQuery(
    api.queries.getProfile,
    authUserId && !isEmailAuthToken ? { userId: authUserId } : "skip"
  );
  const featuredWager = wagers[0];
  const isProfileLoading = Boolean(authUserId && profile === undefined);
  const isAuthenticated = useMemo(
    () => Boolean(authUserId && profile),
    [authUserId, profile]
  );

  useEffect(() => {
    if (hasSeededDemoData) {
      return;
    }
    hasSeededDemoData = true;
    seedDemoData();
  }, [seedDemoData]);

  useEffect(() => {
    if (authUserId && profile === null) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthUserId(null);
    }
  }, [authUserId, profile]);

  useEffect(() => {
    if (!authUserId || !isEmailAuthToken || users === undefined) {
      return;
    }

    const matchingUser = userList.find((user) => user.email === authUserId);
    if (!matchingUser) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthUserId(null);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, matchingUser.id);
    setAuthUserId(matchingUser.id);
  }, [authUserId, isEmailAuthToken, userList, users]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const result = await authenticate({ username, password });
      if (!result?.userId) {
        setAuthError("We couldn't find that account. Check your credentials.");
        return;
      }
      localStorage.setItem(AUTH_STORAGE_KEY, result.userId);
      setAuthUserId(result.userId);
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);
    setIsRegistering(true);

    const sanitizedEmail = sanitizeEmail(registerEmail);
    const sanitizedWorkspace = sanitizeInput(registerWorkspace);
    const workspaceMatch = WORKSPACES.find(
      (workspace) => workspace.id === sanitizedWorkspace
    );
    const { isValid, sanitizedValue, message } = getPasswordValidation(
      registerPassword
    );

    setRegisterEmail(sanitizedEmail);
    setRegisterPassword(sanitizedValue);
    setRegisterWorkspace(
      workspaceMatch ? workspaceMatch.id : WORKSPACES[0].id
    );

    if (!sanitizedEmail || !sanitizedEmail.includes("@")) {
      setRegisterError("Enter a valid work email to continue.");
      setIsRegistering(false);
      return;
    }

    if (!workspaceMatch) {
      setRegisterError("Choose a workspace to continue.");
      setIsRegistering(false);
      return;
    }

    if (!isValid) {
      setRegisterError(message);
      setIsRegistering(false);
      return;
    }

    setRegisterSuccess(
      `Registration submitted! We'll set up access for ${workspaceMatch.name}.`
    );
    setRegisterPassword("");
    setIsRegistering(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthUserId(null);
    setAuthError(null);
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-cloud">
        <header className="border-b border-white/60 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-semibold text-white">
              WB
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Work Bets</p>
              <p className="text-xs text-slate-500">
                Loading your workspace...
              </p>
            </div>
          </div>
        </header>
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24 text-sm text-slate-500">
          Checking your credentials…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              disabled
            >
              Sign in
            </button>
          </div>
        </header>
        <AuthLanding
          username={username}
          password={password}
          error={authError}
          isSubmitting={isSubmitting}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleSignIn}
          registerEmail={registerEmail}
          registerPassword={registerPassword}
          registerWorkspace={registerWorkspace}
          registerError={registerError}
          registerSuccess={registerSuccess}
          isRegistering={isRegistering}
          workspaces={WORKSPACES}
          onRegisterEmailChange={(value) =>
            setRegisterEmail(sanitizeEmail(value))
          }
          onRegisterPasswordChange={(value) =>
            setRegisterPassword(sanitizeInput(value))
          }
          onRegisterWorkspaceChange={(value) =>
            setRegisterWorkspace(sanitizeInput(value))
          }
          onRegisterSubmit={handleRegister}
        />
      </div>
    );
  }

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
            onClick={handleSignOut}
          >
            Sign out
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
          {profile ? (
            <UserProfile profile={profile} />
          ) : (
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm text-slate-500">Loading profile...</p>
            </section>
          )}
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
                {(featuredWager?.options ?? []).map((option, index) => (
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
            <AdminPanel users={userList} />
          </div>
        </section>
      </main>
    </div>
  );
}
