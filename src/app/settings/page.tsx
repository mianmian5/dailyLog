export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">设置</h1>
        <p className="text-[#94a3b8] text-sm mt-1">配置 GitHub 和 AI 参数</p>
      </div>

      <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2d2d4a] space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            GitHub 用户名
          </label>
          <input
            type="text"
            defaultValue="mianmian5"
            className="w-full bg-[#0f0f1f] border border-[#2d2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            readOnly
          />
          <p className="text-xs text-[#64748b] mt-1">
            在 .env.local 中修改 GITHUB_USERNAME
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            追踪的仓库
          </label>
          <input
            type="text"
            defaultValue={process.env.NEXT_PUBLIC_TRACKED_REPOS || "全部"}
            className="w-full bg-[#0f0f1f] border border-[#2d2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            readOnly
          />
          <p className="text-xs text-[#64748b] mt-1">
            逗号分隔，在 .env.local 中修改 TRACKED_REPOS
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            AI 模型
          </label>
          <div className="bg-[#0f0f1f] border border-[#2d2d4a] rounded-lg px-3 py-2 text-sm text-[#94a3b8]">
            DeepSeek Chat
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            使用 DeepSeek API 生成报告
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2d2d4a]">
        <h2 className="text-sm font-semibold text-white mb-2">📋 使用说明</h2>
        <ol className="text-xs text-[#94a3b8] space-y-2 list-decimal list-inside">
          <li>在 <code className="text-indigo-300">.env.local</code> 中配置 GitHub Token 和 DeepSeek API Key</li>
          <li>回到仪表盘，选择「今日」或「本周」</li>
          <li>点击「🪄 生成」按钮，AI 自动根据提交记录生成报告</li>
          <li>生成的报告可以在「报告列表」中查看和复制</li>
        </ol>
      </div>
    </div>
  );
}
