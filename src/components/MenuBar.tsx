import { useState } from "react";
import favicon from "../public/favicon.png";

export type NavKey = "board" | "profile" | "admin" | "settings";

export type NavItem = {
  key: NavKey;
  label: string;
};

type MenuAction = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  includeInMobileMenu?: boolean;
};

type MenuBarProps = {
  subtitle: string;
  navigation?: NavItem[];
  activeTab?: NavKey;
  onNavChange?: (key: NavKey) => void;
  action?: MenuAction;
};

export function MenuBar({
  subtitle,
  navigation = [],
  activeTab,
  onNavChange,
  action,
}: MenuBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasNavigation = navigation.length > 0;
  const showMobileToggle = hasNavigation;

  const handleNavClick = (key: NavKey) => {
    onNavChange?.(key);
    setIsMobileMenuOpen(false);
  };

  const actionStyles =
    action?.variant === "ghost"
      ? "rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
      : "rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white";

  return (
    <header className="border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 p-1">
            <img
              src={favicon}
              alt="Work Bets"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Work Bets</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600 sm:text-sm md:flex md:gap-6">
          {navigation.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                activeTab === item.key
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="relative flex items-center gap-3">
          {action && (
            <button
              type="button"
              className={`hidden md:inline-flex ${actionStyles}`}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          )}
          {showMobileToggle && (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="h-0.5 w-5 rounded-full bg-slate-700" />
              </span>
            </button>
          )}
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-12 z-20 w-64 rounded-3xl border border-white/80 bg-white/95 p-3 shadow-2xl backdrop-blur">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    className={`rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
                      activeTab === item.key
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {action?.includeInMobileMenu && (
                  <button
                    type="button"
                    className="mt-2 rounded-2xl bg-slate-900 px-3 py-2 text-left text-sm font-semibold text-white"
                    onClick={() => {
                      action.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
