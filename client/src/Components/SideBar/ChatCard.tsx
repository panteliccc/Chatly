import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  _id: string;
  chatName: string;
  sender?: Users;
  latestMessage: Message;
  className: string;
}
interface Message {
  sender: Users;
  content: string;
}
interface Users {
  _id: string;
  username: string;
  email: string;
  image: string;
}

function ChatCard(props: Props) {
  function getInitials(username: string): string {
    if (!username) return "";
    const names = username.split(" ");
    return names
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  }

  return (
    <div
      className={`flex items-center gap-3 border-b p-3 cursor-pointer hover:bg-accent hover:duration-300 ${props.className}`}
    >
      <Avatar className="w-10 h-10">
        {props.sender ? (
          <AvatarImage src={props.sender?.image} className="w-full h-full rounded-full overflow-hidden"/>
        ) : (
          <AvatarFallback className=" bg-[#272f37]">{getInitials(props.chatName)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <h1 className="text-2xl">{props.chatName}</h1>
        <span>
          {props.latestMessage ? props.latestMessage.content : "start chat"}
        </span>
      </div>
    </div>
  );
}

export default ChatCard;
