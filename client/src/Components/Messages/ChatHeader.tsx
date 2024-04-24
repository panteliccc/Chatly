import React from "react";
import { useChatState } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}

function ChatHeader() {
  const chatState = useChatState();
  const router = useNavigate();
  
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
  const closeChat = () =>{
    router("/")
    chatState.setVisible(false);
  }
  return (
    <div
      className={`flex p-3 justify-between items-center bg-primary border-b border-primary`}
    >
      <div className="flex gap-3 items-center">
        <img
          src={`/arrow-left-solid.svg`}
          alt="login ilustration"
          className=" w-5 md:hidden flex"
          onClick={closeChat}
        />  
        <h2 className={`text-2xl font-semibold`}>
          {chatState.selectedChat?.isGroup
            ? chatState.selectedChat.chatName
            : getSender(chatState.selectedChat?.users)}
        </h2>
      </div>
    </div>
  );
}

export default ChatHeader;
