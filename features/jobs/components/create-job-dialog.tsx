"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { JobType, Workplace } from "../../../app/generated/prisma/enums";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../../components/ui/input-group";
import { useTRPC } from "../../../trpc/client";

const arrayItemSchema = z.object({
  value: z.string().min(1, "Field cannot be empty."),
});

export const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "Job title must be at least 5 characters.")
      .max(64, "Job title must be at most 64 characters."),

    description: z
      .string()
      .min(20, "Description must be at least 20 characters.")
      .max(1000, "Description must be at most 1000 characters."),

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
      logo: z
        .string()
        .optional()
        .or(z.literal("")),
    }),

    location: z
      .string()
      .min(2, "Location is required.")
      .max(100, "Location must be at most 100 characters."),

    salaryMin: z.number().min(0),

    salaryMax: z.number().min(0),
    currency: z.enum(["USD", "PHP", "EUR"], {
      message: "Please select a currency.",
    }),

    requirements: z
      .array(arrayItemSchema)
      .min(1, "Add at least one requirement."),

    benefits: z.array(arrayItemSchema).min(1, "Add at least one benefit."),

    tags: z.array(arrayItemSchema).min(1, "Add at least one tag."),

    type: z.enum(JobType, {
      message: "Please select a job type.",
    }),

    workplace: z.enum(Workplace, {
      message: "Please select a workplace type.",
    }),
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than minimum salary.",
    path: ["salaryMax"],
  });

export type JobFormValues = z.infer<typeof formSchema>;

export function CreateJobDialog() {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      company: {
        name: "",
        description: "",
        website: "",
        logo: "",
      },
      location: "",
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      requirements: [{ value: "" }],
      benefits: [{ value: "" }],
      tags: [{ value: "" }],
      type: JobType.FULL_TIME,
      workplace: Workplace.ONSITE,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const jobQueryKey = trpc.job.getAll.queryKey();
  const createJobMutation = useMutation(
    trpc.job.create.mutationOptions({
      onSuccess: () => {
        toast.success("Job created successfully!");
        form.reset();
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: jobQueryKey });
      },
      onError: (error) => {
        toast.error(
          error.message || "An error occurred while creating the job.",
        );
      },
    }),
  );

  const [open, setOpen] = useState(false);

  const requirementsFieldArray = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const benefitsFieldArray = useFieldArray({
    control: form.control,
    name: "benefits",
  });

  const tagsFieldArray = useFieldArray({
    control: form.control,
    name: "tags",
  });

  function onSubmit(values: JobFormValues) {
    const payload = {
      ...values,
      requirements: values.requirements.map((item) => item.value),
      benefits: values.benefits.map((item) => item.value),
      tags: values.tags.map((item) => item.value),
      company: {
        name: values.company.name,
        description: values.company.description,
        website: values.company.website,
        logo: values.company.logo,
      },
    };

    createJobMutation.mutate(payload);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className={"bg-white"} variant="outline">
            Post a job
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm xl:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill in the details for the new job posting.
          </DialogDescription>
        </DialogHeader>
        <form
          id="form-job-creation"
          onSubmit={form.handleSubmit(onSubmit)}
          className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"
        >
          <FieldGroup>
            {/* TITLE */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Frontend Engineer"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldDescription>
                    Provide a concise title for your job posting.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* DESCRIPTION */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={field.name}
                      rows={6}
                      className="min-h-24 resize-none"
                      placeholder="Describe the responsibilities and requirements for this role."
                      aria-invalid={fieldState.invalid}
                    />

                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/1000
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <FieldDescription>
                    Include details about the role, responsibilities, and
                    expectations.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* COMPANY (expanded) */}
            <FieldSet>
              <FieldLabel>Company Details</FieldLabel>
              <FieldGroup className="gap-4">
                {/* Company Name */}
                <Controller
                  name="company.name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Company Name *</FieldLabel>
                      <Input {...field} placeholder="TechCorp" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Company Description */}
                <Controller
                  name="company.description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Company Description (optional)</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          rows={3}
                          placeholder="We are a leading technology company..."
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText>
                            {field.value?.length || 0}/500
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Company Website */}
                <Controller
                  name="company.website"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Website (optional)</FieldLabel>
                      <Input {...field} placeholder="https://techcorp.com" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Company Logo URL */}
                <Controller
                  name="company.logo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Logo URL (optional)</FieldLabel>
                      <Input
                        {...field}
                        placeholder="https://techcorp.com/logo.png"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            {/* LOCATION */}
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Location</FieldLabel>

                  <Input
                    {...field}
                    placeholder="San Francisco, CA"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* SALARY */}
            <FieldSet className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="salaryMin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Minimum Salary</FieldLabel>

                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="50000"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="salaryMax"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Maximum Salary</FieldLabel>

                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="100000"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>

            {/* REQUIREMENTS */}
            <FieldSet>
              <FieldLabel>Requirements</FieldLabel>

              <FieldGroup className="gap-3">
                {requirementsFieldArray.fields.map((item, index) => (
                  <Controller
                    key={item.id}
                    name={`requirements.${index}.value`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              placeholder="React experience"
                            />

                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                disabled={
                                  requirementsFieldArray.fields.length === 1
                                }
                                onClick={() =>
                                  requirementsFieldArray.remove(index)
                                }
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    requirementsFieldArray.append({
                      value: "",
                    })
                  }
                >
                  <PlusIcon />
                  Add Requirement
                </Button>
              </FieldGroup>
            </FieldSet>

            {/* BENEFITS */}
            <FieldSet>
              <FieldLabel>Benefits</FieldLabel>

              <FieldGroup className="gap-3">
                {benefitsFieldArray.fields.map((item, index) => (
                  <Controller
                    key={item.id}
                    name={`benefits.${index}.value`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              placeholder="Health Insurance"
                            />

                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                disabled={
                                  benefitsFieldArray.fields.length === 1
                                }
                                onClick={() => benefitsFieldArray.remove(index)}
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    benefitsFieldArray.append({
                      value: "",
                    })
                  }
                >
                  <PlusIcon />
                  Add Benefit
                </Button>
              </FieldGroup>
            </FieldSet>

            {/* TAGS */}
            <FieldSet>
              <FieldLabel>Tags</FieldLabel>

              <FieldGroup className="gap-3">
                {tagsFieldArray.fields.map((item, index) => (
                  <Controller
                    key={item.id}
                    name={`tags.${index}.value`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              placeholder="Frontend Development"
                            />

                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                disabled={tagsFieldArray.fields.length === 1}
                                onClick={() => tagsFieldArray.remove(index)}
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    tagsFieldArray.append({
                      value: "",
                    })
                  }
                >
                  <PlusIcon />
                  Add Tag
                </Button>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />{" "}
          <Button
            form="form-job-creation"
            disabled={createJobMutation.isPending}
            type="submit"
          >
            {createJobMutation.isPending ? (
              <>
                <span>Loading... </span>
                <Loader className="animate-spin" />
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
