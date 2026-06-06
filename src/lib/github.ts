import { Octokit } from "octokit";

let octokit: Octokit | null = null;

function getOctokit() {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;
    octokit = new Octokit(token ? { auth: token } : {});
  }
  return octokit;
}

const USERNAME = process.env.GITHUB_USERNAME || "mianmian5";
const TRACKED_REPOS = (process.env.TRACKED_REPOS || "").split(",").filter(Boolean);

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

export async function getUserRepos(): Promise<RepoStats[]> {
  const octo = getOctokit();
  const repos: RepoStats[] = [];
  let page = 1;
  while (true) {
    const { data } = await octo.rest.repos.listForUser({
      username: USERNAME,
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

export async function getCommits(since: string, until: string): Promise<Commit[]> {
  const octo = getOctokit();
  const allCommits: Commit[] = [];
  const repos = TRACKED_REPOS.length > 0 ? TRACKED_REPOS : await getRepoNames();

  for (const repo of repos) {
    try {
      let page = 1;
      while (true) {
        const { data } = await octo.rest.repos.listCommits({
          owner: USERNAME,
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

async function getRepoNames(): Promise<string[]> {
  const repos = await getUserRepos();
  return repos.map((r) => r.name);
}

export async function getCommitStats(since: string, until: string) {
  const commits = await getCommits(since, until);
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
