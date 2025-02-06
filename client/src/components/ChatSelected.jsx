import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import { formatTime } from "../utils/dateformat";
const ChatSelected = () => {
  const { messages, selectedUser } = useMessageStore();
  const { userAuth } = useAuthStore();
  console.log("messages:", messages, "AuthUser:", userAuth);
  return (
    <div className="w-full h-full p-5">
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
