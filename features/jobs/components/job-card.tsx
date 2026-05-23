import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Banknote, Briefcase, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Company, Job } from "../../../app/generated/prisma/client";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { getPostedDate } from "../../../lib/utils";
import { Logo } from "./logo";

export type JobCardProps = {
  job: Job & { company: Company };
};

export function JobCard({ job }: JobCardProps) {
  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.currency ?? "USD"} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
      : "Salary not specified";

  const postedDate = getPostedDate(job.createdAt);
  console.log(job);
  

  return (
    <Card className="group rounded-md transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex gap-1">
        {/* {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full px-3 py-1 text-sm font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )} */}
        <Logo name={job.company.name} className="w-20 h-20" />
        <div className="ml-4 flex flex-col flex-1 gap-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="line-clamp-1 text-xl">
                  {job.title}
                </CardTitle>

                <CardDescription className="mt-1 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {job.company.name}
                </CardDescription>
              </div>

              {job.type && (
                <Badge variant="secondary" className="rounded-full">
                  {job.type.replace("_", " ")}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* {job.workplace && (
            <Badge variant="outline" className="rounded-full">
              {job.workplace}
            </Badge>
          )} */}

              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full"
              >
                <MapPin className="h-3 w-3" />
                {job.location}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-full"
              >
                <Banknote className="h-3 w-3" />
                {salary}
              </Badge>
            </div>
          </div>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {job.description}
          </p>

          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Requirements</p>

              <ul className="space-y-1 text-sm text-muted-foreground">
                {job.requirements.slice(0, 3).map((requirement) => (
                  <li key={requirement} className="line-clamp-1">
                    • {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {postedDate}
              </div>

              {/* <p>{job._count?.applications ?? 0} applicants</p> */}
            </div>

            <div className="flex gap-2">
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>

              <Link href={`/jobs/${job.id}/apply`}>
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
