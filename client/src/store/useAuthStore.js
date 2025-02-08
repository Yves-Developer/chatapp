import axiosInstance from "../lib/axiosInstance";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  isSigningUp: null,
  isSigningIn: null,
  userAuth: null,
  isCheckingAuth: null,
  socket: null,
  onlineUsers: [],

  checkUserAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      if (res.data) {
        set({ userAuth: res.data });
        get().connectSocket(); // connect socket after auth check
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
        get().connectSocket();
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
        get().connectSocket(); // connect socket after login
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
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
        get().disconnectSocket(); // disconnect socket after logout
      }
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
      console.log("Error:", error);
    }
  },

  connectSocket: () => {
    const { userAuth, socket } = get();
    if (!userAuth || socket?.connected) return;
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      query: { userId: userAuth?.userId || userAuth?.user?._id },
    });

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null }); // Reset the socket instance after disconnecting
    }
  },
}));
