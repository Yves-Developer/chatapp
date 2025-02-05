import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import ChatSelected from "../components/ChatSelected";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import NoChatSelected from "../components/NoChatSelected";
import { useMessageStore } from "../store/useMessageStore";
const HomePage = () => {
  const { messages, getMessages, selectedUser } = useMessageStore();
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      console.log("In if:", selectedUser._id);
    }
    console.log(selectedUser, messages);
  }, [selectedUser, getMessages]);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex justify-center items-center pt-[8px] px-4">
        <div className="bg-base-100 rounded-md shadow-md w-full h-[calc(100vh-6rem)]">
          <div className="flex h-full overflow-hidden rounded-md">
            <SideBar />
            {selectedUser ? (
              <div className="w-full h-full flex flex-1 flex-col overflow-auto">
                <ChatHeader />
                <ChatSelected />
                <MessageInput />
              </div>
            ) : (
              <NoChatSelected />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
