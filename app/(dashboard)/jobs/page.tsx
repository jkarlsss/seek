import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { authenticated } from "../../../lib/server";
import { HydrateClient, prefetch, trpc } from "../../../trpc/server";
import DashboardView from "../../../features/jobs/views/jobs-view";
import JobLoader from "../../../features/jobs/components/job-loader";

export default async function Home() {
  await authenticated(); // This will redirect to sign-in if not authenticated

  prefetch(trpc.job.getAll.queryOptions()); // Prefetch jobs for faster load on the dashboard

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<JobLoader />}>
          <DashboardView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
