import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GoogleTranslate } from "../components/GoogleTranslate";
import { Footer } from "../components/landing/Footer";
import { LotusLogo } from "../components/branding/LotusLogo";
import { useAuth } from "../contexts/AuthContext";

const THEME_STORAGE_KEY = "aarvika-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const navLinkBase =
  "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-200";

const navbarControlClass =
  "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:bg-slate-700 dark:hover:text-indigo-300 dark:focus-visible:ring-indigo-500";

const getNavLinkClass = ({ isActive }) => {
  return `${navLinkBase} ${
    isActive
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
  }`;
};

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white text-slate-800 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white shadow-[0_10px_22px_-14px_rgba(30,41,59,0.35)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_14px_24px_-16px_rgba(2,6,23,0.85)]">
              <LotusLogo className="h-6 w-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-semibold text-slate-800 dark:text-slate-200">
                Aarvika
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                She who grows wealth with wisdom.
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/budget" className={getNavLinkClass}>
              Budget
            </NavLink>
            <NavLink to="/simulator" className={getNavLinkClass}>
              Simulator
            </NavLink>
            <NavLink to="/learning" className={getNavLinkClass}>
              Learning Hub
            </NavLink>
            <NavLink to="/schemes" className={getNavLinkClass}>
              Schemes
            </NavLink>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`${navbarControlClass} h-9 w-9 p-0 md:h-auto md:w-auto md:px-3 md:py-1.5`}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2.2" />
                  <path d="M12 19.8V22" />
                  <path d="m4.9 4.9 1.5 1.5" />
                  <path d="m17.6 17.6 1.5 1.5" />
                  <path d="M2 12h2.2" />
                  <path d="M19.8 12H22" />
                  <path d="m4.9 19.1 1.5-1.5" />
                  <path d="m17.6 6.4 1.5-1.5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
                </svg>
              )}
              <span className="hidden md:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <GoogleTranslate />
            {user ? (
              <>
                <span
                  title={user.email || "Signed in user"}
                  className="max-w-[170px] truncate text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  {user.email || "Signed in user"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${navbarControlClass} px-4 py-2 text-xs`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${navbarControlClass} px-4 py-2 text-xs`}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary px-4 py-2 text-xs">
                  Start your journey
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 md:hidden">
          <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/budget" className={getNavLinkClass}>
              Budget
            </NavLink>
            <NavLink to="/simulator" className={getNavLinkClass}>
              Simulator
            </NavLink>
            <NavLink to="/learning" className={getNavLinkClass}>
              Learning
            </NavLink>
            <NavLink to="/schemes" className={getNavLinkClass}>
              Schemes
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

