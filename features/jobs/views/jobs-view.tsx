"use client";

import { ChevronDown } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { JobCard } from "../components/job-card";
import { SelectionCard } from "../components/selection-card";
import { useTRPC } from "../../../trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function DashboardView() {

  const trpc = useTRPC();
  const { data: jobs } = useSuspenseQuery(trpc.job.getAll.queryOptions()); // Fetch jobs using TRPC and React Query with Suspense

  return (
    <div className="grid grid-cols-4 gap-4 w-full xl:px-40">
      <div className="col-span-1 w-full">
        <SelectionCard />
      </div>

      <div className="col-span-3 flex flex-col gap-4 pb-5">
        <div className="flex gap-4 items-center justify-between">
          <div>
            <Badge
              variant="outline"
              className="bg-white border-0 text-base p-5"
            >
              Trending
            </Badge>
            <Badge variant="outline" className="border-0 text-base p-5">
              Newest
            </Badge>
            <Badge variant="outline" className="border-0 text-base p-5">
              Remote
            </Badge>
          </div>
          <div>
            <ChevronDown size={20} />
          </div>
        </div>
        {jobs.map((job) => (
          <JobCard key={job.id} job={{ ...job, createdAt: new Date(job.createdAt), updatedAt: new Date(job.updatedAt) }} />
        ))}
      </div>
    </div>
  );
}
