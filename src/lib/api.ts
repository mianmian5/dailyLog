const BASE = "/dailylog";

export function api(path: string): string {
  return `${BASE}${path}`;
}
