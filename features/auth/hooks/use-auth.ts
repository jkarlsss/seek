"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
          callbackURL: "/jobs",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/jobs");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong.");
          },
        },
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
          callbackURL: "/jobs",
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Logged in successfully!");
            router.push("/jobs");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong.");
          },
        },
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

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setLoading(false);
          router.push("/sign-in"); // redirect to sign-in page after logout
        },
      },
    });
  };

  return {
    logout,
    loading,
  };
}
