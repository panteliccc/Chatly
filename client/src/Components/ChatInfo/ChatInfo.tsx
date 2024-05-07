import React, { useEffect, useState } from "react";
import ChatInfoHeader from "./ChatInfoHeader";
import { useChatState } from "../../Context/Provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import GroupPeople from "./GroupPeople";
import { ScrollArea } from "../ui/scrollarea";
interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}
function ChatInfo() {
  const chatState = useChatState();
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
  return (
    <div
      className={`w-screen md:w-4/12 xl:w-3/12 border-0 md:border-l overflow-hidden ${
        chatState.openInfo ? "flex" : "hidden"
      } h-screen flex-col`}
    >
      <ScrollArea className="">
        <ChatInfoHeader />
        <div className="h-auto flex flex-col gap-5  py-5 items-center">
          <Avatar className=" w-80 h-80 md:w-64 md:h-64 xl:w-80 xl:h-80 rounded-full">
            {sender?.image ? (
              <AvatarImage
                src={sender?.image}
                className="w-full h-full rounded-full overflow-hidden"
              />
            ) : (
              <AvatarFallback className=" bg-[#272f37] text-7xl">
                {chatState.selectedChat?.isGroup
                  ? chatState.selectedChat.chatName[0].toUpperCase()
                  : sender?.username[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <h1 className="text-2xl">
            {chatState.selectedChat?.isGroup
              ? chatState.selectedChat.chatName
              : sender?.username}
          </h1>
        </div>
        {chatState.selectedChat?.isGroup ? <GroupPeople /> : ""}
      </ScrollArea>
    </div>
  );
}

export default ChatInfo;
