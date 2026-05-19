"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

export function useSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signUp = async ({ email, password, name }: SignUpInput) => {
    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong.");
          },
        }
      );

      if (error) {
        toast.error(error.message || "Failed to create account.");
        return null;
      }

      return data;
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
  };
}

export function useSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signIn = async ({ email, password }: SignUpInput) => {
    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong.");
          },
        }
      );

      if (error) {
        toast.error(error.message || "Failed to create account.");
        return null;
      }

      return data;
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    loading,
  };
}