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
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-white sticky top-0 z-30">
          <div className="text-lg font-bold text-indigo-600">📊 DailyLog</div>
          {/* Hamburger — client component handles toggle */}
          <HamburgerButton />
        </header>

        <div className="flex min-h-[calc(100vh-56px)] md:min-h-screen">
          {/* Sidebar — client component handles open/close */}
          <SidebarNav />

          {/* Overlay for mobile */}
          <SidebarOverlay />

          {/* Main */}
          <main className="flex-1 p-4 md:p-6 overflow-auto bg-[var(--color-bg)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

/* ---------- Client interactivity via inline script ---------- */
/* We avoid a full client wrapper by using a minimal pattern:
   a hidden checkbox drives the open/close state. */

function HamburgerButton() {
  return (
    <label
      htmlFor="sidebar-toggle"
      className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer select-none"
      aria-label="打开菜单"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </label>
  );
}

function SidebarNav() {
  return (
    <>
      <input
        type="checkbox"
        id="sidebar-toggle"
        className="hidden peer"
        autoComplete="off"
      />
      <nav
        id="sidebar"
        className="sidebar-nav w-[var(--sidebar-width)] shrink-0 border-r border-[var(--color-border)] p-5 space-y-1.5 bg-white peer-checked:open"
      >
        <div className="hidden md:block text-lg font-bold text-indigo-600 mb-6">
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
      <style>{`
        #sidebar-toggle:checked ~ #sidebar { left: 0; }
        #sidebar-toggle:checked ~ #sidebar-overlay { display: block; }
        @media (min-width: 768px) { #sidebar { left: 0 !important; } }
      `}</style>
    </>
  );
}

function SidebarOverlay() {
  return (
    <label
      id="sidebar-overlay"
      htmlFor="sidebar-toggle"
      className="sidebar-overlay"
    />
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
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-gray-100 transition-colors text-sm"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </a>
  );
}
