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
    const socket = useAuthStore.getState().socket;
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    socket.on("newMessage", (sentMessage) => {
      if (sentMessage.senderId !== selectedUser._id) return;
      const sound = new Audio("/sounds/notification.mp3");
      sound.play();
      set((state) => ({ messages: [...state.messages, sentMessage] }));
    });

    socket.on("messageSeen", (seenMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) => {
          const seenMsg = seenMessage.find((m) => m._id === msg._id);
          return seenMsg ? { ...msg, status: seenMsg.status } : msg;
        }),
      }));
    });
    var typingSound = new Audio("/sounds/typing.mp3");
    typingSound.loop = true;

    // Listen for typing events
    socket.on("userTyping", ({ senderId }) => {
      if (senderId !== selectedUser._id) return;
      if (typingSound.paused) {
        typingSound
          .play()
          .catch((err) => console.error("Audio play failed:", err));
      }

      set((state) => ({
        isTyping: { ...state.isTyping, [senderId]: true },
      }));
    });

    // Listen for stop typing
    socket.on("stoppedTyping", ({ senderId }) => {
      if (!typingSound.paused) {
        typingSound.pause();
        typingSound.currentTime = 0; // Reset to start
      }

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
    }, 2000);
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    const socket = useAuthStore.getState().socket;
    const myId =
      useAuthStore.getState().userAuth?.user?._id ||
      useAuthStore.getState().userAuth?.userId;
    console.log(useAuthStore.getState().userAuth?.user?._id);

    if (selectedUser) {
      socket.emit("activeChat", { userId: myId, chatWith: selectedUser._id });
    }
  },
}));
