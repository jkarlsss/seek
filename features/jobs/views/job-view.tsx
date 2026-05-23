"use client";

// app/jobs/[id]/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Clock,
    DollarSign,
    MapPin,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTRPC } from "../../../trpc/client";
import { Logo } from "../components/logo";

// Helper: format salary range
function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "USD",
) {
  if (!min && !max) return "Salary not specified";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`;
  if (min) return `${formatter.format(min)}+`;
  return `Up to ${formatter.format(max!)}`;
}

export default function JobView({ params }: { params: { jobId: string } }) {
  const trpc = useTRPC();
  const jobQueryOptions = trpc.job.getById.queryOptions({ id: params.jobId });
  const { data: job } = useSuspenseQuery(jobQueryOptions);

  console.log(job);

  if (!job) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/jobs">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <Card className="p-4">
            <div className="flex">
              <Logo name={job.company.name} className="w-28 h-28" />
              <div className="flex flex-col gap-2 ml-3">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-xl text-muted-foreground">
                  {job.company.name}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{job.workplace}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator />

            {/* Tags */}
            {job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            {/* Job Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {job.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-3">Benefits</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {job.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </section>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{job.location}</p>
              </div>
              <div>
                <p className="font-medium">Job Type</p>
                <p className="text-muted-foreground">{job.type}</p>
              </div>
              <div>
                <p className="font-medium">Workplace</p>
                <p className="text-muted-foreground">{job.workplace}</p>
              </div>
              <div>
                <p className="font-medium">Salary</p>
                <p className="text-muted-foreground">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                </p>
              </div>
              <div>
                <p className="font-medium">Posted</p>
                <p className="text-muted-foreground">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Card */}
          {job.company && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                {job.company.logo && <Logo name={job.company.name} />}
                <CardTitle>{job.company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {job.company.description ||
                    "No company description provided."}
                </p>
                <Link href={`/companies/${job.company.id}`}>
                  <Button variant="outline" className="w-full">
                    View Company Profile →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-center gap-3 space-y-0">
              <CardTitle>Ready to join our team?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>Apply now to join our team and help us grow.</p>
              <Button variant="default" className="w-full">
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
