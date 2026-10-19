// Tests for the favourites cookie format and persistence.
import { afterEach, describe, expect, it } from "vitest";
import {
  FAVORITE_COOKIE_NAME,
  parseFavoriteCookie,
  readFavoriteIds,
  serializeFavoriteCookie,
  writeFavoriteIds,
} from "../src/Services/FavoriteCookie";

describe("parseFavoriteCookie", () => {
  it("returns [] when the cookie is absent", () => {
    expect(parseFavoriteCookie("other=1; theme=dark")).toEqual([]);
  });

  it("reads ids among other cookies, dropping duplicates and invalid ids", () => {
    const header = `a=1; ${FAVORITE_COOKIE_NAME}=fdg-2027%2Cieee-tog%2Cfdg-2027%2C%3Cscript%3E; b=2`;
    expect(parseFavoriteCookie(header)).toEqual(["fdg-2027", "ieee-tog"]);
  });
});

describe("serializeFavoriteCookie", () => {
  it("round-trips through parseFavoriteCookie", () => {
    const assignment = serializeFavoriteCookie(["b-2027", "a-2027"], "/GameRelatedCfPs/");
    expect(assignment).toContain("Path=/GameRelatedCfPs/");
    expect(assignment).toContain("SameSite=Lax");
    const pair = assignment.split(";")[0] ?? "";
    expect(parseFavoriteCookie(pair)).toEqual(["a-2027", "b-2027"]);
  });
});

describe("document cookie persistence", () => {
  afterEach(() => {
    writeFavoriteIds([], "/");
  });

  it("stores and restores favourites", () => {
    writeFavoriteIds(["chi-play-2027"], "/");
    expect(readFavoriteIds()).toEqual(["chi-play-2027"]);
  });
});
