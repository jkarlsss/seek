import SignInCard from "../../../features/auth/components/sign-in-card";
import { unauthenticated } from "../../../lib/server";

const SignIn = async () => {
  await unauthenticated(); // This will redirect to sign-in if not authenticated(); // This will redirect to sign-in if not authenticated
  return <SignInCard />;
};

export default SignIn;
