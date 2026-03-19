export type CookieSameSite = 'lax' | 'strict' | 'none';

export interface SetCookieOptions {
  /** Max-Age in seconds. */
  maxAge?: number;
  path?: string;
  sameSite?: CookieSameSite;
  secure?: boolean;
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const encodedName = encodeURIComponent(name);
  const parts = document.cookie.split('; ');
  for (const part of parts) {
    if (!part) continue;
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const k = part.slice(0, eqIdx);
    if (k !== encodedName) continue;
    const v = part.slice(eqIdx + 1);
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  }
  return undefined;
}

export function setCookie(name: string, value: string, opts: SetCookieOptions = {}): void {
  if (typeof document === 'undefined') return;
  const {
    maxAge,
    path = '/',
    sameSite = 'lax',
    secure = window.location.protocol === 'https:',
  } = opts;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (typeof maxAge === 'number') cookie += `; Max-Age=${Math.max(0, Math.floor(maxAge))}`;
  cookie += `; Path=${path}`;
  cookie += `; SameSite=${sameSite}`;
  if (secure) cookie += '; Secure';
  document.cookie = cookie;
}

export function deleteCookie(name: string): void {
  setCookie(name, '', { maxAge: 0 });
}

