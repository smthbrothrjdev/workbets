import { useState } from "react";
import faviconUrl from "../public/favicon.png";

export function MenuBar({
  subtitle,
  action,
  navigation = [],
  activeTab,
  onTabChange,
}) {
  const hasNavigation = navigation.length > 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (key) => {
    onTabChange?.(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500">
            <img
              src={faviconUrl}
              alt="Work Bets icon"
              className="h-6 w-6"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Work Bets</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        {(hasNavigation || action) && (
          <div className="flex items-center gap-3">
            {hasNavigation && (
              <>
                <nav className="hidden items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600 sm:flex sm:text-sm md:gap-6">
                  {navigation.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleTabClick(item.key)}
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
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 p-2 text-slate-600 sm:hidden"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  onClick={() =>
                    setIsMobileMenuOpen((previous) => !previous)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </>
            )}
            {action}
          </div>
        )}
      </div>
      {hasNavigation && isMobileMenuOpen && (
        <div className="border-t border-white/60 bg-white/80 px-6 py-4 sm:hidden">
          <nav
            id="mobile-menu"
            className="flex flex-col gap-2 text-sm font-semibold text-slate-600"
          >
            {navigation.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleTabClick(item.key)}
                className={`rounded-xl px-3 py-2 text-left transition ${
                  activeTab === item.key
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
