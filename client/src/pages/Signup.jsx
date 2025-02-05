import { Lock, Mail, User } from "lucide-react";
import React from "react";
import DecorativeGrid from "../components/DecorativeGrid";

const Signup = () => {
  return (
    <div className="grid lg:grid-cols-2 mini-h-screen w-full">
      {/* Left */}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center gap-4 mb-2.5">
          <div className="w-[40px] bg-primary/10 p-2 rounded-sm">
            <img src="/paper-plane.svg" alt="icon" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-primary">Enter your details to continue</p>
        </div>
        {/* Form */}
        <form className="flex flex-col gap-4 w-[300px] space-y-6">
          <label className="input">
            <User size={20} />
            <input type="text" className="grow" placeholder="Full Name" />
          </label>
          <label className="input">
            <Mail size={20} />
            <input type="email" className="grow" placeholder="Email" />
          </label>
          <label className="input">
            <Lock size={20} />
            <input
              type="password"
              className="grow"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            />
          </label>
          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
      {/* Right */}
      <DecorativeGrid
        title="Join Our Community"
        description="Connect with like-minded people and engage in exciting discussions."
      />
    </div>
  );
};

export default Signup;
