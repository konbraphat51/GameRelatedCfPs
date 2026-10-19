// Persists the viewer's favourite venue ids in a first-party cookie.

/** Name of the cookie holding favourite ids. */
export const FAVORITE_COOKIE_NAME = "game-related-cfps-favorites";

// Browsers cap cookie lifetime at 400 days; one year keeps well within it.
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

/** Matches a venue id (kebab-case ASCII), so tampered values are ignored. */
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Extracts the favourite ids from a `document.cookie`-style string. */
export function parseFavoriteCookie(cookieHeader: string): string[] {
  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${FAVORITE_COOKIE_NAME}=`));
  if (entry === undefined) {
    return [];
  }
  const value = decodeURIComponent(entry.slice(FAVORITE_COOKIE_NAME.length + 1));
  const ids = value.split(",").filter((id) => ID_PATTERN.test(id));
  return [...new Set(ids)];
}

/** Builds the `Set-Cookie`-style assignment that stores the given ids under `path`. */
export function serializeFavoriteCookie(ids: Iterable<string>, path: string): string {
  const value = encodeURIComponent([...ids].sort().join(","));
  return `${FAVORITE_COOKIE_NAME}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=${path}; SameSite=Lax`;
}

/** Reads favourite ids from the browser cookie jar; returns [] when cookies are unavailable. */
export function readFavoriteIds(): string[] {
  try {
    return parseFavoriteCookie(document.cookie);
  } catch {
    return [];
  }
}

/** Writes favourite ids to the browser cookie jar; failures (cookies blocked) are ignored. */
export function writeFavoriteIds(ids: Iterable<string>, path: string): void {
  try {
    document.cookie = serializeFavoriteCookie(ids, path);
  } catch {
    // Favourites then only last for the current page view.
  }
}
