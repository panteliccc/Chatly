import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  _id: string;
  chatName: string;
  image: string;
  //users: Users[];
  latestMessage: Message;
  className:string;
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
    const names = username.split(" ");
    return names
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  }
  return (
    <div
      className={`flex items-start gap-3 border-b py-3 cursor-pointer hover:bg-accent rounded ${props.className}`}
    >
      <Avatar className="w-10 h-10">
        {props.image ? (
          <AvatarImage src={props.image} />
        ) : (
          <AvatarFallback>
            {getInitials(props.chatName)}
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className="text-2xl">{props.chatName}</h1>
    </div>
  );
}

export default ChatCard;
