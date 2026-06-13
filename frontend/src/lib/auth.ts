const COOKIE_NAME = "medas_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setToken(token: string): void {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearToken(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
