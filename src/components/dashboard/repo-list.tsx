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
      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2d2d4a]">
        <h2 className="text-sm font-semibold text-white mb-4">📦 仓库列表</h2>
        <div className="text-[#94a3b8] text-sm">加载中...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 border border-[#2d2d4a]">
      <h2 className="text-sm font-semibold text-white mb-4">📦 仓库列表</h2>
      <div className="space-y-2">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/mianmian5/${repo.name}`}
            target="_blank"
            className="block px-4 py-3 rounded-lg hover:bg-[#1f1f3a] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-white">{repo.name}</span>
                {repo.language && (
                  <span className="text-xs flex items-center gap-1.5 text-[#94a3b8]">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] || "#8b8b8b",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
              </div>
            </div>
            {repo.description && (
              <p className="text-xs text-[#64748b] mt-1 line-clamp-1">
                {repo.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
