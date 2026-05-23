import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch, trpc } from "../../../../trpc/server";
import JobLoader from "../../../../features/jobs/components/job-loader";
import JobView from "../../../../features/jobs/views/job-view";

export default async function JobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  prefetch(trpc.job.getById.queryOptions({ id: jobId }));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<JobLoader />}>
          <JobView params={{ jobId }} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
