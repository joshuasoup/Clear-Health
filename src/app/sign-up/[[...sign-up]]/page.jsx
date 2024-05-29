import { SignUp, SignIn } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage