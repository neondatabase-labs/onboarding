import { githubReq, vercel, vercelToken } from "@/lib/clients";
import { sodiumEncrypt } from "@/lib/sodium";
import { createApiClient } from "@neondatabase/api-client";
import { str10_36 } from "hyperdyperid/lib/str10_36";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function New({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const h = await headers();
  const p = await searchParams;
  const neonApiKey = p["neon-key"];
  if (!neonApiKey || neonApiKey instanceof Array) throw notFound();

  const neon = createApiClient({ apiKey: neonApiKey });
  let neonProject = p["neon-project"];
  if (!neonProject || neonProject instanceof Array) throw notFound();
  try {
    if (neonProject) await neon.getProject(neonProject);
    else
      neonProject = (
        await neon.createProject({
          project: { name: "Onboarding" },
        })
      ).data.project.id;
  } catch (e) {
    console.error(e);
    throw notFound();
  }
  const id = str10_36();

  await Promise.all([
    (async () => {
      await vercel.projects.createProject({
        requestBody: {
          name: `neon-onboarding-${id}`,
          framework: "nextjs",
        },
      });
      await vercel.projects.updateProject({
        idOrName: `neon-onboarding-${id}`,
        requestBody: { ssoProtection: null },
      });
    })(),
    (async () => {
      await githubReq("POST /repos/{template_owner}/{template_repo}/generate", {
        template_owner: "neon-onboarding",
        template_repo: "neon-onboarding-template",
        owner: "neon-onboarding",
        name: `neon-onboarding-${id}`,
        include_all_branches: false,
      });
      await Promise.all([
        (async () => {
          const {
            data: { key: repoSecretsKey, key_id: repoSecretsKeyId },
          } = await githubReq(
            "GET /repos/{owner}/{repo}/actions/secrets/public-key",
            {
              owner: "neon-onboarding",
              repo: `neon-onboarding-${id}`,
            }
          );

          await Promise.all([
            githubReq(
              "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
              {
                owner: "neon-onboarding",
                repo: `neon-onboarding-${id}`,
                secret_name: "NEON_API_KEY",
                encrypted_value: await sodiumEncrypt(
                  neonApiKey,
                  repoSecretsKey
                ),
                key_id: repoSecretsKeyId,
              }
            ),
            githubReq(
              "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
              {
                owner: "neon-onboarding",
                repo: `neon-onboarding-${id}`,
                secret_name: "VERCEL_API_KEY",
                encrypted_value: await sodiumEncrypt(
                  vercelToken,
                  repoSecretsKey
                ),
                key_id: repoSecretsKeyId,
              }
            ),
          ]);
        })(),

        Promise.all([
          githubReq("POST /repos/{owner}/{repo}/actions/variables", {
            owner: "neon-onboarding",
            repo: `neon-onboarding-${id}`,
            name: "NEON_PROJECT_ID",
            value: neonProject,
          }),
          githubReq("POST /repos/{owner}/{repo}/actions/variables", {
            owner: "neon-onboarding",
            repo: `neon-onboarding-${id}`,
            name: "NEON_ONBOARDING_ID",
            value: id,
          }),
          githubReq("POST /repos/{owner}/{repo}/actions/variables", {
            owner: "neon-onboarding",
            repo: `neon-onboarding-${id}`,
            name: "NEON_ONBOARDING_ORIGIN",
            value: `${h.get("x-forwarded-proto")}://${h.get(
              "x-forwarded-host"
            )}`,
          }),
        ]),

        githubReq("PATCH /repos/{owner}/{repo}", {
          owner: "neon-onboarding",
          repo: `neon-onboarding-${id}`,
          delete_branch_on_merge: true,
        }),
      ]);
    })(),
  ]);

  throw redirect(`/onboarding/${id}`);
}
