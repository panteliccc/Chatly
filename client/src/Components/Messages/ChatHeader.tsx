import React, { useEffect, useState } from "react";
import { useChatState } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  const [sender, setSender] = useState<User | null>(null);

  const getSender = (users: User[] | null | undefined) => {
    const loggedUser = chatState.authUser;
    if (!users || users.length === 0) {
      return null;
    }

    const isSenderDeleted = users.some(
      (user) => user._id !== loggedUser?._id && user.isDeleted
    );

    if (isSenderDeleted) {
      return null;
    }

    const isSender = users[0]?._id === loggedUser?._id;
    const newSender = isSender ? users[1] : users[2];

    setSender(newSender);
    return newSender;
  };

  useEffect(() => {
    getSender(chatState?.selectedChat?.users);
  }, [chatState?.selectedChat?.users]);

  const closeChat = () => {
    router("/");
    chatState.setVisible(false);
  };

  return (
    <div
      className={`flex p-3 justify-between items-center bg-primary border-b border-primary`}
    >
      <div className="flex gap-2 items-center ">
        <img
          src={`/arrow-left-solid.svg`}
          alt="login ilustration"
          className=" w-4 md:hidden flex"
          onClick={closeChat}
        />
        <Avatar className="w-10 h-10 rounded-full">
          {sender?.image ? (
            <AvatarImage
              src={sender?.image}
              className="w-full h-full rounded-full overflow-hidden"
            />
          ) : (
            <AvatarFallback className=" bg-[#272f37]">
              {chatState.selectedChat?.isGroup
                ? chatState.selectedChat.chatName[0]
                : sender?.username[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className={`text-2xl font-semibold`}>
          {chatState.selectedChat?.isGroup
            ? chatState.selectedChat.chatName
            : sender?.username || ""}
        </h2>
      </div>
    </div>
  );
}

export default ChatHeader;
