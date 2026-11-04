import "server-only";
import { SITE } from "@/lib/seo/site";
import { cached, TAGS } from "@/lib/cache";

export type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
};

export type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
  avatar_url: string;
};

export type GitHubWeek = { days: number[] };

export type GitHubData = {
  ok: boolean;
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  weeks: GitHubWeek[];
};

const FALLBACK: GitHubData = { ok: false, profile: null, repos: [], weeks: [] };

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": `${SITE.name}-portfolio`,
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type GraphQlContributions = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: Array<{ contributionDays?: Array<{ contributionCount: number }> }>;
        };
      };
    };
  };
};

async function fetchContributionWeeks(login: string): Promise<GitHubWeek[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": `${SITE.name}-portfolio`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{contributionCount}}}}}}`,
        variables: { login },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as GraphQlContributions;
    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    return weeks.map((w) => ({ days: (w.contributionDays ?? []).map((d) => d.contributionCount) }));
  } catch {
    return [];
  }
}

export const getGitHubData = cached(
  async (): Promise<GitHubData> => {
    const user = SITE.githubUser;
    const [profile, repos] = await Promise.all([
      fetchJson<GitHubProfile>(`https://api.github.com/users/${user}`),
      fetchJson<GitHubRepo[]>(`https://api.github.com/users/${user}/repos?sort=updated&per_page=12`),
    ]);
    if (!profile && !repos) return FALLBACK;
    const filtered = (repos ?? [])
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6);
    const weeks = await fetchContributionWeeks(user);
    return { ok: true, profile, repos: filtered, weeks };
  },
  ["github-data"],
  [TAGS.github],
  3600,
);
