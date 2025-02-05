import { axiosInstance } from "../lib/axiosInstance";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  userAuth: null,
  // setUserAuth: (userAuth) => set({ userAuth }),
  checkUserAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data) {
        set({ userAuth: res.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data) {
        set({ userAuth: res.data });
        toast.success("Account created Successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  logOut: async () => {
    const res = await axiosInstance.get("/auth/signout");
    if (res.data) {
      set({ userAuth: null });
      toast.success("Account Logout Successfully!");
    }
  },
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      if (res.data) {
        set({ userAuth: res.data });
        toast.success("Account Logged Successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
