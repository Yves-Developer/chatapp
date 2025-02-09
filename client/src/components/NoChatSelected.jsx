import React from "react";

const NoChatSelected = () => {
  return (
    <div className="max-sm:hidden flex flex-1 flex-col justify-center items-center w-full p-8 space-y-4">
      <img
        src="/paper-plane.svg"
        alt="icon"
        className="w-24 h-24 p-4 bg-primary/10 rounded-md animate-bounce"
      />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold">Welcome to Chatify</h1>
        <p className="text-base text-center text-base-content/10">
          Connect with like-minded people and engage in exciting discussions.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
