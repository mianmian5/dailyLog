/**
 * Client-side configuration stored in localStorage.
 * Users can set their own GitHub username from the Settings page.
 */

const KEYS = {
  GITHUB_USERNAME: "dailylog_github_username",
  TRACKED_REPOS: "dailylog_tracked_repos",
};

export function getGitHubUsername(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEYS.GITHUB_USERNAME) || "mianmian5";
}

export function setGitHubUsername(name: string) {
  localStorage.setItem(KEYS.GITHUB_USERNAME, name);
}

export function getTrackedRepos(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.TRACKED_REPOS);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function setTrackedRepos(repos: string) {
  localStorage.setItem(KEYS.TRACKED_REPOS, repos);
}
