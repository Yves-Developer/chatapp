import { X, CornerDownLeft } from "lucide-react";
import Avatar from "./Avatar";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
//todo:online USER
const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isTyping } = useMessageStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="w-full border-b border-base-200 flex items-center justify-between p-2">
      <div className="flex items-center gap-4 w-full rounded-md">
        <Avatar
          imgUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          userData={selectedUser._id}
        />
        <div className="text-left min-w-0">
          <p className="font-medium truncate">{selectedUser?.fullname}</p>
          <p className="text-sm text-base-content/10">
            {isTyping[selectedUser._id]
              ? "Typing..."
              : onlineUsers?.includes(selectedUser._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="block lg:hidden  text-zinc-400 mr-4 bg-primary/10 p-2 rounded-sm hover:text-white cursor-pointer"
      >
        <CornerDownLeft size="20" />
      </button>
      <button
        onClick={() => setSelectedUser(null)}
        className="hidden lg:block text-zinc-400 mr-4 bg-primary/10 p-2 rounded-sm hover:text-white cursor-pointer"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
