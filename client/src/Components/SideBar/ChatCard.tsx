import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatState } from "../../Context/Provider";

interface Props {
  _id: string;
  chatName: string;
  sender?: Users | null | undefined;
  latestMessage?: Message;
  isGroup?: boolean;
  className: string;
}
interface Message {
  user: Users;
  text: string;
  createdAt: string;
  isImage: boolean;
}
interface Users {
  _id: string;
  username: string;
  email: string;
  image: string;
}

function ChatCard(props: Props) {
  const chatState = useChatState();

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return new Date(date).toLocaleDateString();
    }
  };
  return (
    <div
      className={`flex items-center gap-3 border-b p-3 cursor-pointer hover:bg-primary hover:duration-300 ${props.className}`}
    >
      <Avatar className="w-10 h-10">
        {props.sender?.image ? (
          <AvatarImage
            src={props.sender?.image}
            className="w-full h-full rounded-full overflow-hidden"
          />
        ) : (
          <AvatarFallback className=" bg-[#272f37]">
            {props.chatName[0]}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="text-2xl flex justify-between items-center w-full">
          <h1 className="text-2xl">{props.chatName}</h1>
          {props.latestMessage && (
            <span className="text-sm">
              {formatDate(new Date(props.latestMessage.createdAt))}
            </span>
          )}
        </div>
        <span className="line-clamp-1">
          {props.latestMessage
            ? props.isGroup &&
              chatState.authUser?._id !== props.latestMessage.user._id
              ? `${props.latestMessage.user.username}: `
              : props.latestMessage.user._id === chatState.authUser?._id
              ? "you: "
              : ""
            : "start chat"}
          {props.latestMessage?.isImage
            ? "sent image"
            : props.latestMessage && props.latestMessage.text}
        </span>
      </div>
    </div>
  );
}

export default ChatCard;
