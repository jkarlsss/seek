import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth"; // path to your Better Auth server instance

export const authenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return redirect("/sign-in"); // redirect to sign-in page if not authenticated
  }
  return session;
};

export const unauthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (session) {
    return redirect("/"); // redirect to home page if authenticated
  }
  return session;
};
