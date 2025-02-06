import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
export const useMessageStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/message/users");
      if (res.data) set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  getMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      if (res.data) set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      if (res.data) set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
