import { Image, Loader2, Send, X } from "lucide-react";
import { useMessageStore } from "../store/useMessageStore";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
const MessageInput = () => {
  const { sendMessage, isSendingMsg, emitTypingEvent } = useMessageStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();
  const removeImage = () => {
    setImage(null);
    fileInputRef.current.value = "";
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("File must be Image!");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text && !image) return;
    sendMessage({ text: text.trim(), image });
    // reset text
    setText("");
    fileInputRef.current.value = "";
    setImage(null);
  };
  return (
    <div className="p-4">
      {image && (
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <img
              src={image}
              className="w-20 h-20 object-cover rounded-md border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-neutral p-0.5 text-white rounded-full cursor-pointer"
            >
              <X size={10} />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
        <div className="flex flex-1 gap-2 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              emitTypingEvent();
            }}
            className="w-full input input-bordered roundered-lg input-sm ms:input-md"
            placeholder="Type a message..."
          />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
          <button
            type="button"
            onClick={handleUpload}
            className="sm:flex text-zinc-400 bg-primary/10 p-2 rounded-sm hover:text-white cursor-pointer"
          >
            <Image size={20} />
          </button>
          <button
            type="submit"
            className="sm:flex text-zinc-400 bg-primary/10 p-2 rounded-sm hover:text-white cursor-pointer"
            disabled={isSendingMsg}
          >
            {isSendingMsg ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
