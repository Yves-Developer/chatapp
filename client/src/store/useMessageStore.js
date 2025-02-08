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
  isTyping: {},

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
    if (!selectedUser) return; // If no selected user, return early

    socket.on("newMessage", (sentMessage) => {
      if (sentMessage.senderId !== selectedUser._id) return;
      const sound = new Audio("/sounds/notification.mp3");
      sound.play();
      set({ messages: [...get().messages, sentMessage] });
    });

    // Listen for typing events
    socket.on("userTyping", ({ senderId }) => {
      set((state) => ({
        isTypingUsers: { ...state.isTyping, [senderId]: true },
      }));
    });
    //Listen for stop styping
    socket.on("stoppedTyping", ({ senderId }) => {
      set((state) => {
        const updatedTyping = { ...state.isTyping };
        delete updatedTyping[senderId];
        return { isTyping: updatedTyping };
      });
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket; // Access socket using getState()
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("stoppedTyping");
  },
  emitTypingEvent: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();
    if (!selectedUser) return;

    socket.emit("typing", { receiverId: selectedUser._id });

    setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1000);
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
