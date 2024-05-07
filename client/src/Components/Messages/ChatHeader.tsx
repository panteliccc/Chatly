import React, { useEffect, useState } from "react";
import { useChatState } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/popover";
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
    const newSender = isSender ? users[1] : users[0];

    setSender(newSender);
    return newSender;
  };

  useEffect(() => {
    getSender(chatState?.selectedChat?.users);
  }, [chatState?.selectedChat?.users]);

  const closeChat = () => {
    router("/");
    chatState.setVisible(false);
    chatState.setSelectedChat(null);
    chatState.setOpenInfo(false);
  };
  const back = () => {
    router("/");
    chatState.setVisible(false);
  };
  return (
    <DropdownMenu>
      <div
        className={`flex justify-between items-center bg-primary border-b border-primary p-2`}
      >
        <img
          src={`/arrow-left-solid.svg`}
          alt="login ilustration"
          className=" w-4 md:hidden flex cursor-pointer"
          onClick={back}
        />
        <div
          className="flex gap-2 items-center md:hover:bg-border cursor-pointer px-2 py-1 rounded"
          onClick={() => {
            chatState.setOpenInfo(true);
          }}
        >
          <Avatar className="w-10 h-10 rounded-full">
            {sender?.image || chatState.selectedChat?.groupImage ? (
              <AvatarImage
                src={sender?.image || chatState.selectedChat?.groupImage}
                className="w-full h-full rounded-full overflow-hidden"
              />
            ) : (
              <AvatarFallback className=" bg-[#272f37]">
                {chatState.selectedChat?.isGroup
                  ? chatState.selectedChat.chatName[0].toUpperCase()
                  : sender?.username[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className={`text-2xl font-semibold`}>
            {chatState.selectedChat?.isGroup
              ? chatState.selectedChat.chatName
              : sender?.username}
          </h2>
        </div>
        <DropdownMenuTrigger>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="text-2xl cursor-pointer mr-1"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="rounded absolute right-0 w-60 bg-border">
        <DropdownMenuItem
          className="text-lg cursor-pointer px-4"
          onClick={() => {
            chatState.setOpenInfo(true);
          }}
        >
          {chatState.selectedChat?.isGroup ? "Group info" : "Account info"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-lg cursor-pointer px-4"
          onClick={closeChat}
        >
          Close chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ChatHeader;
