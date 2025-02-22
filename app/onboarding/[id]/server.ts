"use server";

import { githubReq } from "@/lib/clients";
import { notFound, redirect } from "next/navigation";

const getWorkflowRuns = async (repoId: string) => {
  try {
    return (
      await githubReq("GET /repos/{owner}/{repo}/actions/runs", {
        owner: "neon-onboarding",
        repo: `neon-onboarding-${repoId}`,
      })
    ).data.workflow_runs;
  } catch (error) {
    console.error(error);
    throw notFound();
  }
};

export const checkInitialDeploy = async (repoId: string) => {
  const workflow_runs = await getWorkflowRuns(repoId);
  if (
    workflow_runs.some(
      ({ name, status }) =>
        name === ".github/workflows/production.yaml" && status === "completed"
    )
  )
    throw redirect(`https://neon-onboarding-${repoId}.vercel.app`);
};

export const checkPreviewDeploy = async (
  repoId: string,
  pullNumber: number
) => {
  const workflow_runs = await getWorkflowRuns(repoId);
  const latestRun = workflow_runs.find(
    ({ name, pull_requests }) =>
      name === ".github/workflows/preview.yaml" &&
      pull_requests?.[0]?.number === pullNumber
  );
  if (latestRun?.status === "completed")
    throw redirect(
      `https://neon-onboarding-${repoId}-pr${pullNumber}.vercel.app`
    );
};

export const checkMergeDeploy = async (repoId: string, pullNumber: number) => {
  const workflow_runs = await getWorkflowRuns(repoId);
  const latestRun = workflow_runs.find(
    ({ name, display_title }) =>
      name === ".github/workflows/production.yaml" &&
      display_title.startsWith(`Merge pull request #${pullNumber}`)
  );
  if (latestRun?.status === "completed")
    throw redirect(`https://neon-onboarding-${repoId}.vercel.app`);
};
