const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

interface CommitData {
  total: number;
  repoBreakdown: { repo: string; count: number }[];
  dailyActivity: { date: string; count: number }[];
  commits: { message: string; repo: string; date: string }[];
}

async function callDeepSeek(prompt: string): Promise<string> {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "你是一个研发效率助手，能够根据GitHub提交记录生成简洁明了的工作日报和周报。用中文回答，语气自然专业。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function generateDailyReport(
  date: string,
  stats: CommitData
): Promise<string> {
  const commitsText = stats.commits
    .slice(0, 30)
    .map((c) => `  - [${c.repo}] ${c.message} (${c.date.slice(11, 19)})`)
    .join("\n");

  const prompt = `请根据以下 GitHub 提交记录，生成一份今天（${date}）的工作日报。

## 今日概况
- 总提交次数：${stats.total}
- 涉及项目：${stats.repoBreakdown.map((r) => `${r.repo}(${r.count}次)`).join("、")}

## 提交详情
${commitsText || "（暂无提交记录）"}

## 要求
请按以下格式输出：
1. **今日工作概要** - 一句话总结今天做了什么
2. **详细进展** - 按项目列出具体做了什么
3. **技术亮点** - 如果有特别的技术点或解决的关键问题
4. **明日计划** - 简单规划明天要做的事
5. **今日感想** - 一句话感受`;

  return callDeepSeek(prompt);
}

export async function generateWeeklyReport(
  weekRange: string,
  stats: CommitData,
  dailySummaries?: string[]
): Promise<string> {
  const commitStats = `- 本周总提交：${stats.total}次
- 项目分布：${stats.repoBreakdown.map((r) => `${r.repo}(${r.count}次)`).join("、")}
- 每日活跃：${stats.dailyActivity.map((d) => `${d.date}: ${d.count}次`).join(" | ")}`;

  const dailyContext = dailySummaries
    ? `\n## 每日日报摘要\n${dailySummaries
        .map((s, i) => `第${i + 1}天：${s.slice(0, 200)}`)
        .join("\n\n")}`
    : "";

  const commitsText = stats.commits
    .slice(0, 40)
    .map((c) => `  - [${c.repo}] ${c.message}`)
    .join("\n");

  const prompt = `请根据以下 GitHub 提交记录，生成一份本周（${weekRange}）的周报。

## 本周统计
${commitStats}
${dailyContext}

## 提交详情
${commitsText || "（暂无提交记录）"}

## 要求
请按以下格式输出：
1. **本周总览** - 一句话概括本周工作
2. **项目进展** - 每个项目的关键进展
3. **技能成长** - 学到了什么新东西 or 用了什么新技术
4. **遇到的问题** - 任何值得记录的技术挑战
5. **下周计划** - 下一周的主要目标`;

  return callDeepSeek(prompt);
}
