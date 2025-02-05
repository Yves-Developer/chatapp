import React from "react";
import SideBar from "../components/SideBar";
import ChatSelected from "../components/ChatSelected";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";

const HomePage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex justify-center items-center pt-[8px] px-4">
        <div className="bg-base-100 rounded-md shadow-md w-full h-[calc(100vh-6rem)]">
          <div className="flex h-full overflow-hidden rounded-md">
            <SideBar />
            <div className="w-full h-full flex flex-1 flex-col overflow-auto">
              <ChatHeader />
              <ChatSelected />
              <MessageInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
