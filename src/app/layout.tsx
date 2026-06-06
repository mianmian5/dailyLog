import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DailyLog — 效率仪表盘",
  description: "个人 GitHub 效率仪表盘 + AI 日报/周报",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <nav className="w-56 shrink-0 border-r border-[#2d2d4a] p-6 space-y-2 bg-[#0a0a1a]">
            <div className="text-xl font-bold mb-8 text-indigo-400">
              📊 DailyLog
            </div>
            <SidebarLink href="/dailylog/" icon="🏠">
              仪表盘
            </SidebarLink>
            <SidebarLink href="/dailylog/reports" icon="📝">
              报告列表
            </SidebarLink>
            <SidebarLink href="/dailylog/settings" icon="⚙️">
              设置
            </SidebarLink>
          </nav>

          {/* Main */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1a1a2e] transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </a>
  );
}
