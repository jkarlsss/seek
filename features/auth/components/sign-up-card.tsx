"use client";

import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { useSignUp } from "@/features/auth/hooks/use-auth";
import { Loader } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .nonempty("Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters."),
});

export default function SignUpCard() {
  const { signUp, loading } = useSignUp();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    signUp(data);
  }

  return (
    <Card className="w-full min-w-100 max-w-sm">
      <div className="flex flex-col items-center justify-center">
        <Image src={"/seeker.svg"} alt="Seeker" width={70} height={70} />
        <h1 className="text-primary text-2xl font-semibold">Seeker</h1>
      </div>
      <CardHeader>
        <CardTitle className="mb-5">Create an account</CardTitle>
        <CardDescription className="mb-5">
          Enter your details below to create an account
        </CardDescription>
        <CardAction>
          <Link href="/sign-in">
            <Button variant="link">Sign In</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-6">
        <Button disabled={loading} type="submit" form="form-rhf-login" className="w-full">
          {loading ? (
            <>  
            <span>Loading...</span>
            <Loader className="animate-spin" />
            </>
          ) : "Create Account"}
        </Button>
        <Button variant="outline" className="w-full flex gap-3">
          <Image src={"/google.svg"} alt="Google" width={20} height={20} />
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
