import { Badge } from "../../../components/ui/badge";
import { JobCard } from "../components/job-card";
import { SelectionCard } from "../components/selection-card";
import { jobs } from "../data/data";

export default function DashboardView() {
  return (
    <div className="grid grid-cols-4 gap-4 w-full xl:px-40">
      <div className="col-span-4 flex gap-4 justify-center items-center">
        <Badge variant="outline" className="bg-white text-base p-6">
          Trending
        </Badge>
        <Badge variant="outline" className="bg-white text-base p-6">
          Newest
        </Badge>
        <Badge variant="outline" className="bg-white text-base p-6">
          Remote
        </Badge>
      </div>
      <div className="col-span-1 w-full">
        <SelectionCard />
      </div>

      <div className="col-span-3 flex flex-col gap-4 pb-5">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
