import { X } from "lucide-react";
import Avatar from "./Avatar";
const ChatHeader = () => {
  return (
    <div className="w-full border-b border-base-200 flex items-center justify-between p-2">
      <div className="flex items-center gap-4 w-full rounded-md">
        <Avatar imgUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        <div className="text-left min-w-0">
          <p className="font-medium truncate">John Doe</p>
          <p className="text-sm text-base-content/10">Online</p>
        </div>
      </div>
      <button className="text-zinc-400">
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
