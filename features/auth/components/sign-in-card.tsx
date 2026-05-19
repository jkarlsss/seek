"use client";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/features/auth/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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

export default function SignInCard() {
  const { signIn, loading } = useSignIn();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    signIn(data);
  }

  return (
    <Card className="w-full min-w-100 max-w-sm">
      <div className="flex flex-col items-center justify-center">
        <Image src={"/seeker.svg"} alt="Seeker" width={70} height={70} />
        <h1 className="text-primary text-2xl font-semibold">Seeker</h1>
      </div>
      <CardHeader>
        <CardTitle className="mb-5">Login to your account</CardTitle>
        <CardDescription className="mb-5">
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link href="/sign-up">
            <Button variant="link">Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">Email</FieldLabel>
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
                  <FieldLabel htmlFor="form-rhf-password">Password</FieldLabel>
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
        <Button
          disabled={loading}
          type="submit"
          form="form-rhf-login"
          className="w-full"
        >
          {loading ? (
            <>
              <span>Loading...</span>
              <Loader className="animate-spin" />
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        <Button variant="outline" className="w-full flex gap-3">
          <Image src={"/google.svg"} alt="Google" width={20} height={20} />
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
