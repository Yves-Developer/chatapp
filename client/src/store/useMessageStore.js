import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => {
  // Centralized typing sound instance to avoid multiple creations
  // let typingSound;
  // fetch("/sounds/typing.mp3")
  //   .then((res) => res.blob())
  //   .then((blob) => {
  //     typingSound = new Audio(URL.createObjectURL(blob));
  //     typingSound.loop = true;
  //     typingSound.volume = 0.1;
  //   })
  // .catch((err) => console.error("Failed to load typing sound:", err));

  return {
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
        new Audio("/sounds/notification.mp3").play();
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

      socket.on("userTyping", ({ senderId }) => {
        if (senderId !== selectedUser._id) return;

        set((state) => {
          const updatedTyping = { ...state.isTyping, [senderId]: true };
          // // Ensure typing sound plays when at least one user is typing
          // if (Object.keys(updatedTyping).length === 1 && typingSound) {
          //   typingSound
          //     .play()
          //     .catch((err) => console.error("Audio play failed:", err));
          // }
          return { isTyping: updatedTyping };
        });
      });

      socket.on("stoppedTyping", ({ senderId }) => {
        set((state) => {
          const updatedTyping = { ...state.isTyping };
          delete updatedTyping[senderId];
          // Stop typing sound only when no one is typing
          // if (Object.keys(updatedTyping).length === 0) {
          //   typingSound.pause();
          //   typingSound.currentTime = 0;
          // }
          return { isTyping: updatedTyping };
        });
      });
    },

    unsubscribeFromMessage: () => {
      const socket = useAuthStore.getState().socket;
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
      socket.emit("activeChat", { userId: myId, chatWith: selectedUser });
    },
  };
});
