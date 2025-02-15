import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import { formatTime } from "../utils/dateformat";
import { useEffect, useRef } from "react";

const ChatSelected = () => {
  const messageEndRef = useRef(null);
  const { userAuth } = useAuthStore();
  const {
    messages,
    isGettingMsg,
    getMessages,
    selectedUser,
    subscribeToMessage,
    unsubscribeFromMessage,
    isTyping,
  } = useMessageStore();

  // When the selected user changes, fetch messages WITHOUT marking them as seen.
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id, true);
    }
  }, [selectedUser]);

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [selectedUser, messages.status]);

  useEffect(() => {
    if (messages && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages, isTyping]);

  if (isGettingMsg) {
    return (
      <div className="w-full h-full p-5 flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 overflow-y-auto p-5">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat ${
            userAuth?.userId === message.senderId ||
            userAuth?.user?._id === message.senderId
              ? "chat-end"
              : "chat-start"
          } `}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div className="chat-header">
            <time className="text-xs opacity-50">
              {formatTime(message.createdAt)}
            </time>
          </div>
          <div
            className={`chat-bubble ${
              userAuth?.userId === message.senderId ||
              userAuth?.user?._id === message.senderId
                ? "bg-primary"
                : ""
            }`}
          >
            {message.image && (
              <img
                src={message.image}
                className="sm:max-w-[200px] mb-2 rounded-md"
              />
            )}
            {message.text}
          </div>
          <div className="chat-footer opacity-50">
            {userAuth?.userId === message.senderId ||
            userAuth?.user?._id === message.senderId
              ? message.status
              : ""}
          </div>
        </div>
      ))}

      {/* User is typing */}
      {selectedUser && isTyping[selectedUser._id] && (
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div className="chat-bubble">
            <div className="flex items-center space-x-1">
              <div className="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              <div className="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      )}
      {/* Scroll to bottom */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatSelected;
