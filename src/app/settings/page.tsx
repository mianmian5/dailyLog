"use client";

import { useEffect, useState } from "react";
import { getGitHubUsername, setGitHubUsername, getTrackedRepos, setTrackedRepos } from "@/lib/config";

export default function SettingsPage() {
  const [username, setUsernameState] = useState("mianmian5");
  const [repos, setReposState] = useState("mcp-hunt,fantuan,dailylog");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUsernameState(getGitHubUsername());
    setReposState(getTrackedRepos().join(","));
  }, []);

  function save() {
    setGitHubUsername(username.trim() || "mianmian5");
    setTrackedRepos(repos.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          设置
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
          配置你的 GitHub 信息
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 md:p-6 border border-[var(--color-border)] space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            GitHub 用户名
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsernameState(e.target.value)}
            placeholder="例如: mianmian5"
            className="w-full bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            你的 GitHub 用户名，用于拉取仓库和提交记录
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            追踪的仓库（可留空 = 全部）
          </label>
          <input
            type="text"
            value={repos}
            onChange={(e) => setReposState(e.target.value)}
            placeholder="例如: mcp-hunt,fantuan"
            className="w-full bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            逗号分隔的仓库名。留空则追踪所有仓库
          </p>
        </div>

        <button
          onClick={save}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
        >
          {saved ? "✅ 已保存" : "💾 保存设置"}
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-indigo-800 mb-2">
          💡 使用说明
        </h2>
        <ul className="text-xs text-indigo-700 space-y-1.5 list-disc list-inside">
          <li>填好 GitHub 用户名后，回到仪表盘点击「🔄 刷新」</li>
          <li>数据加载后点「🪄 生成」出日报/周报</li>
          <li>设置保存在浏览器本地，下次打开还在</li>
          <li>如果想用别的 GitHub 账号，改用户名就行</li>
        </ul>
      </div>
    </div>
  );
}
