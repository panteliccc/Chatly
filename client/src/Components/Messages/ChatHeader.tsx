import React from "react";

function ChatHeader() {
  return (
    <div
      className={`flex p-3 justify-between items-center bg-primary border-b border-primary `}
    >
      <h2 className={`text-2xl font-semibold`}>Messages</h2>
      
    </div>
  );
}

export default ChatHeader;
