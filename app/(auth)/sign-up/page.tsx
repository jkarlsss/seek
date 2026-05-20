import SignUpCard from "../../../features/auth/components/sign-up-card";
import { unauthenticated } from "../../../lib/server";

const SignUp = async () => {
  await unauthenticated(); // This will redirect to sign-in if not authenticated(); // This will redirect to sign-in if not authenticated

  return <SignUpCard />;
};

export default SignUp;
