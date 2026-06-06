export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">
          设置
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm mt-0.5">
          配置 GitHub 和 AI 参数
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 md:p-6 border border-[var(--color-border)] space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            GitHub 用户名
          </label>
          <input
            type="text"
            defaultValue="mianmian5"
            className="w-full bg-gray-50 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            readOnly
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            在 .env.local 中修改 GITHUB_USERNAME
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            追踪的仓库
          </label>
          <input
            type="text"
            defaultValue="全部 (Filter in .env.local)"
            className="w-full bg-gray-50 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            readOnly
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            逗号分隔，在 .env.local 中修改 TRACKED_REPOS
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            AI 模型
          </label>
          <div className="bg-gray-50 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)]">
            DeepSeek Chat
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            使用 DeepSeek API 生成报告
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 md:p-6 border border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
          📋 使用说明
        </h2>
        <ol className="text-xs text-[var(--color-text-muted)] space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            在 <code className="text-indigo-600 bg-indigo-50 px-1 rounded">.env.local</code>{" "}
            中配置 GitHub Token 和 DeepSeek API Key
          </li>
          <li>回到仪表盘，选择「今日」或「本周」</li>
          <li>
            点击「🪄 生成」按钮，AI 自动根据提交记录生成报告
          </li>
          <li>生成的报告可以在「报告列表」中查看和复制</li>
        </ol>
      </div>
    </div>
  );
}
