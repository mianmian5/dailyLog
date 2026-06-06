import { Octokit } from "octokit";

let octokit: Octokit | null = null;

function getOctokit() {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;
    octokit = new Octokit(token ? { auth: token } : {});
  }
  return octokit;
}

export interface Commit {
  sha: string;
  message: string;
  repo: string;
  date: string;
  url: string;
}

export interface RepoStats {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  pushedAt: string;
}

export async function getUserRepos(
  username?: string
): Promise<RepoStats[]> {
  const user = username || process.env.GITHUB_USERNAME || "mianmian5";
  const octo = getOctokit();
  const repos: RepoStats[] = [];
  let page = 1;
  while (true) {
    const { data } = await octo.rest.repos.listForUser({
      username: user,
      per_page: 100,
      page,
      sort: "updated",
      type: "owner",
    });
    if (data.length === 0) break;
    for (const r of data) {
      repos.push({
        name: r.name,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        language: r.language ?? null,
        description: r.description ?? null,
        pushedAt: r.pushed_at ?? new Date().toISOString(),
      });
    }
    page++;
    if (data.length < 100) break;
  }
  return repos;
}

export async function getCommits(
  since: string,
  until: string,
  username?: string,
  trackedRepos?: string[]
): Promise<Commit[]> {
  const user = username || process.env.GITHUB_USERNAME || "mianmian5";
  const defaultRepos = (process.env.TRACKED_REPOS || "")
    .split(",")
    .filter(Boolean);
  const repos = trackedRepos && trackedRepos.length > 0 ? trackedRepos : defaultRepos;
  const octo = getOctokit();
  const allCommits: Commit[] = [];

  // If no repos specified, fetch all user repos first
  let targetRepos = repos;
  if (targetRepos.length === 0) {
    const allRepos = await getUserRepos(user);
    targetRepos = allRepos.map((r) => r.name);
  }

  for (const repo of targetRepos) {
    try {
      let page = 1;
      while (true) {
        const { data } = await octo.rest.repos.listCommits({
          owner: user,
          repo,
          since,
          until,
          per_page: 100,
          page,
        });
        if (data.length === 0) break;
        for (const c of data) {
          allCommits.push({
            sha: c.sha.slice(0, 7),
            message: (c.commit.message || "").split("\n")[0],
            repo,
            date: c.commit.author?.date || c.commit.committer?.date || "",
            url: c.html_url,
          });
        }
        page++;
        if (data.length < 100) break;
      }
    } catch {
      // skip repos that error
    }
  }

  return allCommits.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getCommitStats(
  since: string,
  until: string,
  username?: string,
  trackedRepos?: string[]
) {
  const commits = await getCommits(since, until, username, trackedRepos);
  const repoMap = new Map<string, number>();
  const dateMap = new Map<string, number>();

  for (const c of commits) {
    repoMap.set(c.repo, (repoMap.get(c.repo) || 0) + 1);
    const day = c.date.slice(0, 10);
    dateMap.set(day, (dateMap.get(day) || 0) + 1);
  }

  const repoBreakdown = Array.from(repoMap.entries())
    .map(([repo, count]) => ({ repo, count }))
    .sort((a, b) => b.count - a.count);

  const dailyActivity = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total: commits.length,
    commits,
    repoBreakdown,
    dailyActivity,
  };
}
