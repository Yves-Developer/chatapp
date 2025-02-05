import { Image, Send } from "lucide-react";
import React from "react";

const MessageInput = () => {
  return (
    <div className="p-4 w-full">
      <form className="flex gap-2 items-center">
        <div className="flex flex-1 gap-2 items-center">
          <input
            type="text"
            className="w-full input input-bordered roundered-lg input-sm ms:input-md"
            placeholder="Type a message..."
          />
          <button className="sm:flex btn btn-square text-zinc-400">
            <Image size={20} />
          </button>
          <button className="sm:flex btn btn-square text-zinc-400">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
