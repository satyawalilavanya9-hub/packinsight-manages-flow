// Lightweight localStorage-based session for the PackInsight demo.
// The architecture is intentionally kept thin so a real backend
// (PHP / MySQL / REST) can slot in without touching the UI layer.

import { CURRENT_USER, type Role } from "./mock-data";

const SESSION_KEY = "packinsight.session";
const THEME_KEY = "packinsight.theme";

export interface Session {
  email: string;
  role: Role;
  name: string;
  loggedInAt: string;
}

export function login(email: string, _password: string, role: Role, remember: boolean): Session {
  const session: Session = {
    email: email || CURRENT_USER.email,
    role,
    name: CURRENT_USER.name,
    loggedInAt: new Date().toISOString(),
  };
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (window.localStorage.getItem(THEME_KEY) as "light" | "dark") ?? "light";
}

export function setTheme(theme: "light" | "dark") {
  window.localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function applyStoredTheme() {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", getTheme() === "dark");
}
