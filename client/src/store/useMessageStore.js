import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => {
  return {
    messages: [],
    users: [],
    unreadMessages: {},
    unreadMessageCount: {},
    selectedUser: null,
    isSendingMsg: false,
    isGettingMsg: false,
    isGettingUser: false,
    isTyping: {},

    getUsers: async () => {
      set({ isGettingUser: true });
      try {
        const res = await axiosInstance.get("/message/users");
        if (res.data) set({ users: res.data });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } finally {
        set({ isGettingUser: false });
      }
    },
    getMessages: async (userId, markSeen = false) => {
      set({ isGettingMsg: true });
      try {
        // Append the query parameter markSeen to the URL.
        const res = await axiosInstance.get(
          `/message/${userId}?markSeen=${markSeen}`
        );
        if (res.data) {
          set((state) => ({
            messages: res.data,
          }));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch messages"
        );
      } finally {
        set({ isGettingMsg: false });
      }
    },

    getUnreadMessages: async (userId, markSeen = false) => {
      try {
        const res = await axiosInstance.get(
          `/message/${userId}?markSeen=${markSeen}`
        );
        if (res.data) {
          const unread = res.data.filter(
            (message) => message.status !== "seen"
          );
          // Update both the count and the messages separately
          set((state) => ({
            unreadMessageCount: {
              ...state.unreadMessageCount,
              [userId]: unread.length,
            },
            unreadMessages: {
              ...state.unreadMessages,
              [userId]: unread,
            },
          }));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch messages"
        );
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
        toast.error(error.response?.data?.message || "Failed to send message");
      } finally {
        set({ isSendingMsg: false });
      }
    },

    subscribeToMessage: () => {
      const socket = useAuthStore.getState().socket;
      const selectedUser = get().selectedUser;
      if (!selectedUser) return;

      socket.on("newMessage", (sentMessage) => {
        const { senderId } = sentMessage;
        if (senderId !== selectedUser._id) return;
        new Audio("/sounds/notification.mp3").play();
        set((state) => ({
          messages: [...state.messages, sentMessage],
          unreadMessageCount: {
            ...state.unreadMessageCount,
            [senderId]: (state.unreadMessageCount[senderId] || 0) + 1,
          },
        }));
      });

      socket.on("messageSeen", (seenMessages) => {
        if (!seenMessages.length) return;
        const { senderId } = seenMessages[0];

        set((state) => ({
          unreadMessageCount: {
            ...state.unreadMessageCount,
            [senderId]: 0, // Reset unread count when seen
          },
          messages: state.messages.map((msg) => {
            const seenMsg = seenMessages.find((m) => m._id === msg._id);
            return seenMsg ? { ...msg, status: seenMsg.status } : msg;
          }),
        }));
      });

      socket.on("userTyping", ({ senderId }) => {
        if (senderId !== selectedUser._id) return;

        set((state) => ({
          isTyping: { ...state.isTyping, [senderId]: true },
        }));
      });

      socket.on("stoppedTyping", ({ senderId }) => {
        set((state) => {
          const updatedTyping = { ...state.isTyping };
          delete updatedTyping[senderId];
          return { isTyping: updatedTyping };
        });
      });
    },

    unsubscribeFromMessage: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
      socket.off("messageSeen");
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
