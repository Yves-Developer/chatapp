import axios from "axios";
import { create } from "zustand";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});
export const useAuthStore = create((set) => ({
  userAuth: null,
  setUserAuth: (userAuth) => set({ userAuth }),
  checkUserAuth: async () => {
    const res = await axiosInstance.get("/auth/check");
    if (res.data) {
      set({ userAuth });
    }
  },
}));
