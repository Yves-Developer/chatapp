import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

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

  subscribeToMessage: () => {
    const socket = useAuthStore.getState().socket; // Access socket using getState()
    const selectedUser = get().selectedUser; // Access selectedUser here
    if (selectedUser) console.log("slectedUser found");
    if (!selectedUser) return; // If no selected user, return early

    socket.on("newMessage", (sentMessage) => {
      if (sentMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, sentMessage] });
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket; // Access socket using getState()
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
