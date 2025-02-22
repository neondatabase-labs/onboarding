import { githubReq, vercel } from "@/lib/clients";
import { NextRequest } from "next/server";

export const maxDuration = 60;

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
    return new Response("Unauthorized", { status: 401 });

  const minAgeSeconds =
    Number(await req.nextUrl.searchParams.get("min-age-seconds")) ||
    SEVEN_DAYS_SECONDS;

  while (true) {
    const { data: repos } = await githubReq("GET /orgs/{org}/repos", {
      org: "neon-onboarding",
      direction: "asc",
      sort: "created",
    });

    const reposToDelete = repos.filter((repo) => {
      const createdAtTsSec = new Date(repo.created_at || "").getTime() / 1000;
      const ageSeconds = Date.now() / 1000 - createdAtTsSec;
      return (
        ageSeconds > minAgeSeconds && repo.name !== "neon-onboarding-template"
      );
    });

    if (reposToDelete.length === 0) break;

    await Promise.all(
      reposToDelete.map((repo) =>
        Promise.all([
          githubReq("DELETE /repos/{owner}/{repo}", {
            owner: "neon-onboarding",
            repo: repo.name,
          }),
          vercel.projects.deleteProject({ idOrName: repo.name }),
        ])
      )
    );
  }
  return new Response("OK");
}
