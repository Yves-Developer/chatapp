import { Loader2, Lock, Mail, User } from "lucide-react";
import React from "react";
import DecorativeGrid from "../components/DecorativeGrid";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateFileds = () => {
    if (!formData.fullname) toast.error("FullName is required!");
    if (!formData.email) toast.error("Email is required!");
    if (!formData.password) toast.error("Password is required!");

    return formData.fullname && formData.email && formData.password;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFileds();
    if (isValid) {
      signup(formData);
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-primary">Enter your details to continue</p>
        </div>
        {/* Form */}
        <form
          className="flex flex-col gap-4 w-[300px] space-y-6"
          onSubmit={handleSubmit}
        >
          <label className="input">
            <User size={20} />
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
            />
          </label>
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
            disabled={isSigningUp}
          >
            {isSigningUp && <Loader2 className="animate-spin" />}
            Sign Up
          </button>
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
