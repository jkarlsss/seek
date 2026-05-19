import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="flex flex-1 w-full min-h-screen">
        <div className="flex items-center justify-center w-full bg-background">{children}</div>
      </div>
  );
};

export default AuthLayout;
