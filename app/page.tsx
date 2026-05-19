"use client";

import { redirect } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authClient } from "../lib/auth-client";

export default function Home() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/sign-in");
        },
      },
    });
  };

  return (
    <>
      <Input placeholder="gayy" />
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
}
