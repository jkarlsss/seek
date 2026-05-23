import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { JobType, Workplace } from "../../app/generated/prisma/client";
import { createTRPCRouter, protectedProcedure } from "../init";

export const jobRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        company: z.object({
          name: z
            .string()
            .min(2, "Company name must be at least 2 characters.")
            .max(64, "Company name must be at most 64 characters."),
          description: z
            .string()
            .max(500, "Description must be at most 500 characters.")
            .optional(),
          website: z.string().optional().or(z.literal("")),
          logo: z.string().optional().or(z.literal("")),
        }),
        location: z.string().min(1, "Location is required"),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        currency: z.string().default("USD"),
        requirements: z.array(z.string()).default([]),
        benefits: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        type: z.enum(JobType).default(JobType.FULL_TIME),
        workplace: z.enum(Workplace).default(Workplace.REMOTE),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Find or create the company
      const company = await prisma.company.upsert({
        where: { name: input.company.name },
        update: {
          // Optionally update existing company's details if needed
          description: input.company.description ?? undefined,
          website: input.company.website ?? undefined,
          logo: input.company.logo ?? undefined,
        },
        create: {
          name: input.company.name,
          description: input.company.description,
          website: input.company.website,
          logo: input.company.logo,
        },
      });

      // 2. Create the job linked to that company
      return await prisma.job.create({
        data: {
          title: input.title,
          description: input.description,
          companyId: company.id, // ← use the relation
          location: input.location,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          currency: input.currency,
          requirements: input.requirements,
          benefits: input.benefits,
          tags: input.tags,
          type: input.type,
          workplace: input.workplace,
          userId: ctx.user.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async () => {
    return await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true, // Include company details in the job query
      },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.job.findUnique({
        where: { id: input.id },
        include: {
          company: true, // Include company details in the job query
        }
      });
    }),
});
