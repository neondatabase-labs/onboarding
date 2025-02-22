import { githubReq } from "@/lib/clients";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

const openPullRequest = async (repoId: string, newPageTitle: string) => {
  let shaResponseFile, shaResponseMain;
  try {
    [shaResponseFile, shaResponseMain] = await Promise.all([
      githubReq("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "neon-onboarding",
        repo: `neon-onboarding-${repoId}`,
        path: "app/page-title.tsx",
      }),
      githubReq("GET /repos/{owner}/{repo}/git/ref/{ref}", {
        owner: "neon-onboarding",
        repo: `neon-onboarding-${repoId}`,
        ref: "heads/main",
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw notFound();
  }
  if (shaResponseFile.data instanceof Array)
    throw new Error(
      "shaResponseFile.data is an array - app/page-title.tsx is a directory"
    );
  const { sha } = shaResponseFile.data;
  const dateStr = new Date().toISOString().replace(/[^0-9]/g, "");
  const branch = `update-title-${dateStr}`;
  await githubReq("POST /repos/{owner}/{repo}/git/refs", {
    owner: "neon-onboarding",
    repo: `neon-onboarding-${repoId}`,
    ref: `refs/heads/${branch}`,
    sha: shaResponseMain.data.object.sha,
  });
  await githubReq("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: "neon-onboarding",
    repo: `neon-onboarding-${repoId}`,
    path: "app/page-title.tsx",
    sha,
    content: btoa(`export const PAGE_TITLE = "${newPageTitle}";\n`),
    message: `Update page title to "${newPageTitle}"`,
    branch,
  });
  const { data: pr } = await githubReq("POST /repos/{owner}/{repo}/pulls", {
    owner: "neon-onboarding",
    repo: `neon-onboarding-${repoId}`,
    title: `Update page title to "${newPageTitle}"`,
    head: branch,
    base: "main",
  });
  return pr.number;
};

const mergePullRequest = async (repoId: string, pullNumber: number) => {
  try {
    await githubReq("PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge", {
      owner: "neon-onboarding",
      repo: `neon-onboarding-${repoId}`,
      pull_number: pullNumber,
    });
  } catch (error) {
    console.error(error);
    throw notFound();
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const formData = await req.formData();
  const { id } = await params;
  if (!id) throw notFound();
  const action = formData.get("action")?.toString();
  if (action === "open") {
    const newPageTitle = formData.get("newPageTitle")?.toString();
    if (!newPageTitle) throw notFound();
    const pullNumber = await openPullRequest(id, newPageTitle);
    throw redirect(`/onboarding/${id}/pull/${pullNumber}/opened`);
  } else if (action === "merge") {
    const pullNumber = Number(formData.get("pullNumber")?.toString());
    if (!pullNumber) throw notFound();
    await mergePullRequest(id, pullNumber);
    throw redirect(`/onboarding/${id}/pull/${pullNumber}/merged`);
  }
};
