export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="flex flex-col row-start-2 items-center sm:items-stretch border border-gray-500 p-8 rounded-lg m-4">
        <h1 className="text-4xl font-bold tracking-tighter leading-none mb-2">
          Hang tight...
        </h1>
        <p className="mb-6">We&apos;re creating a couple of things for you:</p>
        <ol className="list-decimal list-inside leading-loose w-full mb-6">
          <div className="flex justify-between">
            <li>Neon Postgres DB — created in &lt; 0.5s</li>
            <div>✅</div>
          </div>
          <div className="flex justify-between">
            <li>GitHub repo</li>
            <div>✅</div>
          </div>
          <div className="flex justify-between">
            <li>Vercel deployment</li>
            <div className="animate-pulse">⏳</div>
          </div>
        </ol>
        <div className="border-b border-gray-500"></div>
        <div className="text-sm my-6 leading-loose">
          <div className="mb-2">
            <span className="text-lg">🤓</span> While you&apos;re waiting, did
            you know that Neon...
          </div>
          <div className="ml-4">
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
        <p className="text-xs">
          —<br /> You&apos;ll be redirected once ready.
        </p>
      </main>
    </div>
  );
}
