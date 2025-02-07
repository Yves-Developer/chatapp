import { Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";

const SideBar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isGettingUser } =
    useMessageStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isGettingUser) {
    return (
      <div className="h-full w-20 lg:w-57 border-r border-base-300 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="h-full w-20 lg:w-57 border-r border-base-300 flex flex-col">
      <div className="w-full border-b border-base-300 p-5">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={(e) => setShowOnlineUsers(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Online Only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} Online)
          </span>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-4 w-full p-2 rounded-md hover:bg-base-100 ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <Avatar
              imgUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              userData={user?._id}
            />
            <div className="text-left hidden lg:block min-w-0">
              <p className="font-medium truncate">{user.fullname}</p>
              <p className="text-sm text-base-content/10">
                {onlineUsers?.includes(user?._id) ? "Online" : "Offfline"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
