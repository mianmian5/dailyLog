import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

interface Report {
  id: string;
  type: "daily" | "weekly";
  date: string;
  content: string;
  stats: {
    total: number;
    repoBreakdown: { repo: string; count: number }[];
  };
  createdAt: string;
}

export function getReports(): Report[] {
  try {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveReport(report: Report) {
  const reports = getReports();
  // Replace if same type+date exists
  const idx = reports.findIndex(
    (r) => r.type === report.type && r.date === report.date
  );
  if (idx >= 0) {
    reports[idx] = report;
  } else {
    reports.unshift(report);
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
}

export function getReport(type: "daily" | "weekly", date: string): Report | null {
  const reports = getReports();
  return reports.find((r) => r.type === type && r.date === date) || null;
}
