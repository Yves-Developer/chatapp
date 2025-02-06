import axiosInstance from "../lib/axiosInstance";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  isSigningUp: null,
  isSigningIn: null,
  userAuth: null,
  isCheckingAuth: null,
  // setUserAuth: (userAuth) => set({ userAuth }),
  checkUserAuth: async () => {
    set({ isCheckingAuth: true });
    const { userAuth } = get();
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data) {
        set({ userAuth: res.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data) {
        set({ userAuth: res.data });
        toast.success("Account created Successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      if (res.data) {
        set({ userAuth: res.data });
        toast.success("Account Logged Successfully!");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        // Handle other possible errors (network issues, etc.)
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isSigningIn: false });
    }
  },
  logOut: async () => {
    try {
      const res = await axiosInstance.get("/auth/signout");
      if (res.data) {
        set({ userAuth: null });
        toast.success("Account Logout Successfully!");
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
      console.log("Error :", error);
    }
  },
}));
