import { Poll } from "./client";
import { checkInitialDeploy } from "./server";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const action = checkInitialDeploy.bind(null, id);
  await action();
  return (
    <Poll action={action}>
      <div className="min-h-screen flex flex-col gap-8 p-4 md:py-12 justify-center max-w-screen-sm mx-auto">
        <div className="text-center text-5xl">🚀</div>
        <h1 className="text-center text-5xl tracking-tighter font-bold">
          Hang tight!
        </h1>
        <div className="mb-6 font-bold text-center">
          We&apos;re creating a couple of things for you...
        </div>
        <ol className="list-decimal list-inside leading-loose mb-6">
          <div className="flex justify-between">
            <li>Neon Postgres DB — created in &lt; 0.5s ⚡️</li>
            <div>✅</div>
          </div>
          <div className="flex justify-between">
            <li>
              GitHub{" "}
              <a
                className="underline"
                href={`https://github.com/neon-onboarding/neon-onboarding-${id}`}
                target="_blank"
              >
                repo
              </a>
            </li>
            <div>✅</div>
          </div>
          <div className="flex justify-between">
            <li>
              Vercel deployment — via{" "}
              <a
                className="underline"
                href={`https://github.com/neon-onboarding/neon-onboarding-${id}/actions/workflows/production.yaml`}
                target="_blank"
              >
                GitHub actions
              </a>
            </li>
            <div className="animate-pulse">⏳</div>
          </div>
        </ol>
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
