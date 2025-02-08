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
  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser?._id);
    subscribeToMessage();
    return () => unsubscribeFromMessage();
  }, [selectedUser, getMessages, subscribeToMessage, unsubscribeFromMessage]);

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
      {messages.map((message) => (
        <div
          key={message._id}
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
                alt="Tailwind CSS chat bubble component"
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
            {message.text}
          </div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      ))}
      {/* User is typing */}

      {selectedUser && isTyping[selectedUser._id] && (
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div className="chat-bubble">
            <div class="flex items-center space-x-1">
              <div class="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></div>
              <div class="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              <div class="dot w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      )}
      {/* Scroll To bottom */}
      <div ref={messageEndRef} />
      {/* <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div> */}
    </div>
  );
};

export default ChatSelected;
