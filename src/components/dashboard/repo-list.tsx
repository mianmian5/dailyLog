interface Repo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  pushedAt: string;
}

interface Props {
  repos: Repo[];
  loading: boolean;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#dea584",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Shell: "#89e051",
};

export default function RepoList({ repos, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-5 border border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
          📦 仓库列表
        </h2>
        <div className="text-[var(--color-text-secondary)] text-sm">
          加载中…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 border border-[var(--color-border)]">
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
        📦 仓库列表
      </h2>
      <div className="divide-y divide-[var(--color-border)]">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/mianmian5/${repo.name}`}
            target="_blank"
            className="block px-1 py-3 hover:bg-[var(--color-card-hover)] -mx-1 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm text-[var(--color-text)] truncate">
                  {repo.name}
                </span>
                {repo.language && (
                  <span className="text-xs flex items-center gap-1 text-[var(--color-text-muted)] shrink-0">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] || "#94a3b8",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] shrink-0">
                <span>⭐ {repo.stars}</span>
                <span className="hidden sm:inline">🍴 {repo.forks}</span>
              </div>
            </div>
            {repo.description && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-1">
                {repo.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
