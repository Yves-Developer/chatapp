import { Loader2, Lock, Mail } from "lucide-react";
import React from "react";
import DecorativeGrid from "../components/DecorativeGrid";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
const Signin = () => {
  const { login, isSigningIn } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const validateFields = () => {
    if (!formData.email) toast.error("Email is required");
    if (!formData.password) toast.error("Password is required");
    return formData.email && formData.password;
  };
  const handleSunmit = (e) => {
    e.preventDefault();
    const isValid = validateFields();
    if (isValid) {
      login(formData);
    }
  };
  return (
    <div className="grid lg:grid-cols-2 mini-h-screen w-full">
      {/* Left */}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center gap-4 mb-2.5">
          <div className="w-[40px] bg-primary/10 p-2 rounded-sm">
            <img src="/paper-plane.svg" alt="icon" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-primary">Enter your details to continue</p>
        </div>
        {/* Form */}
        <form
          onSubmit={handleSunmit}
          className="flex flex-col gap-4 w-[300px] space-y-6"
        >
          <label className="input">
            <Mail size={20} />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </label>
          <label className="input">
            <Lock size={20} />
            <input
              type="password"
              className="grow"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSigningIn}
          >
            {isSigningIn && <Loader2 className="animate-spin" />}
            Sign In
          </button>
        </form>
        <div className="mt-3 flex items-center gap-2">
          <p className="text-sm text-zinc-400">Don&apos;t have account?</p>
          <Link to="/signup" className="text-primary">
            Create Account
          </Link>
        </div>
      </div>
      {/* Right */}
      <DecorativeGrid
        title="Join Our Community"
        description="Connect with like-minded people and engage in exciting discussions."
      />
    </div>
  );
};

export default Signin;
