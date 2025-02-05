import { Users } from "lucide-react";
import React from "react";
import Avatar from "./Avatar";

const SideBar = () => {
  return (
    <div className="h-full w-20 lg:w-57 border-r border-base-300 flex flex-col">
      <div className="w-full border-b border-base-300 p-5">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto py-3">
        <button className="flex items-center gap-4 w-full p-2 rounded-md hover:bg-base-100">
          <Avatar imgUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          <div className="text-left hidden lg:block min-w-0">
            <p className="font-medium truncate">John Doe</p>
            <p className="text-sm text-base-content/10">Online</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
