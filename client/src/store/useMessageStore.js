import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
export const useMessageStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isSendingMsg: null,
  isGettingMsg: null,
  isGettingUser: null,
  getUsers: async () => {
    set({ isGettingUser: true });
    try {
      const res = await axiosInstance.get("/message/users");
      if (res.data) set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingUser: false });
    }
  },
  getMessages: async (userId) => {
    set({ isGettingMsg: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      if (res.data) set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingMsg: false });
    }
  },
  sendMessage: async (messageData) => {
    set({ isSendingMsg: true });
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      if (res.data) set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMsg: false });
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
