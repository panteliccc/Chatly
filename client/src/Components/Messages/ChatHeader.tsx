import React, { useEffect, useState } from "react";
import { useChatState } from "../../Context/Provider";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}

function ChatHeader() {
  const chatState = useChatState();
  const [chatName, setChatName] = useState("");

  const getSender = (users: User[] | null | undefined) => {
    const loggedUser = chatState.authUser;
    if (!users || users.length === 0) {
      return "";
    }

    const isSenderDeleted = users.some(
      (user) => user._id !== loggedUser?._id && user.isDeleted
    );

    if (isSenderDeleted) {
      return "Deleted user";
    }

    const isSender = users[0]?._id === loggedUser?._id;
    return isSender ? users[1].username : users[0]?.username || "Deleted user";
  };
  return (
    <div
      className={`flex p-3 justify-between items-center bg-primary border-b border-primary`}
    >
      <h2 className={`text-2xl font-semibold`}>
        {chatState.selectedChat?.isGroup ? chatState.selectedChat.chatName : getSender(chatState.selectedChat?.users)}
      </h2>
    </div>
  );
}

export default ChatHeader;
