import { GitMergeIcon } from "@primer/octicons-react";
import { notFound } from "next/navigation";
import { Poll } from "../../../client";
import { checkMergeDeploy } from "../../../server";

export default async function PrOpenedPage({
  params,
}: {
  params: Promise<{ id: string; pullNumber: string }>;
}) {
  const { id, pullNumber: pullNumberStr } = await params;
  const pullNumber = Number(pullNumberStr);
  if (isNaN(pullNumber)) throw notFound();
  const action = checkMergeDeploy.bind(null, id, pullNumber);
  await action();
  return (
    <Poll action={action}>
      <div className="min-h-screen flex flex-col gap-8 p-4 md:py-12 justify-center max-w-screen-sm mx-auto">
        <div className="text-center text-purple-500">
          <GitMergeIcon className="inline" size={"large"} />
        </div>
        <h1 className="text-center text-5xl tracking-tighter font-bold">
          Pull-request merged!
        </h1>
        <div className="mb-6">
          Now GitHub Actions is{" "}
          <a
            href={`https://github.com/neon-onboarding/neon-onboarding-${id}/actions/workflows/preview.yaml`}
            target="_blank"
            className="underline"
          >
            deploying
          </a>{" "}
          your changes to your production environment. You&apos;ll be redirected
          to it once it&apos;s ready. It&apos;s also{" "}
          <a
            href={`https://github.com/neon-onboarding/neon-onboarding-${id}/actions/workflows/preview-cleanup.yaml`}
            target="_blank"
            className="underline"
          >
            removing
          </a>{" "}
          the database branch.
        </div>
        <div className="border-b border-gray-500"></div>
        <div className="my-6 leading-loose">
          <div className="mb-2 text-lg font-bold">
            <span className="text-xl">🤓</span> While you&apos;re waiting, did
            you know that Neon...
          </div>
          <div className="ml-6">
            <div>... is SOC2 / GDPR / ISO 27001 compliant</div>
            <div>
              ... constantly replicates your data to super-durable object
              storage
            </div>
            <div>
              ... has{" "}
              <a
                className="underline"
                href="https://calendly.com/d/ckxx-b4h-69y/neon-solutions-engineering"
                target="_blank"
                rel="noopener noreferrer"
              >
                a Solutions Engineer at your disposal
              </a>{" "}
              if you have a lot of data
            </div>
            <div>
              ... has saved 80% of some customers&apos; bills with autoscaling
            </div>
          </div>
        </div>
        <p className="text-xs text-center">
          —<br /> You&apos;ll be redirected once ready.
        </p>
      </div>
    </Poll>
  );
}
