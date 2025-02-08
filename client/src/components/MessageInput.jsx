import { Image, Loader2, Send } from "lucide-react";
import { useMessageStore } from "../store/useMessageStore";
import { useState } from "react";
const MessageInput = () => {
  const { sendMessage, isSendingMsg } = useMessageStore();
  const [text, setText] = useState("");
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text) return;
    sendMessage({ text: text.trim() });
    // reset text
    setText("");
  };
  return (
    <div className="p-4">
      <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
        <div className="flex flex-1 gap-2 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full input input-bordered roundered-lg input-sm ms:input-md"
            placeholder="Type a message..."
          />
          <button className="sm:flex btn btn-square text-zinc-400">
            <Image size={20} />
          </button>
          <button
            className="sm:flex btn btn-square text-zinc-400"
            disabled={isSendingMsg}
          >
            {isSendingMsg ? (
              <Send size={20} />
            ) : (
              <Loader2 className="animate-spin" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
