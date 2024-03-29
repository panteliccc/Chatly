import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  _id: string;
  chatName: string;
  image: string;
  //users: Users[];
  latestMessage: Message;
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
  function getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    do {
      color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (isTooLight(color));
    return color;
  }

  function isTooLight(color: string): boolean {
    const hex = color.substring(1);
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (r + g + b) / 3 > 128;
  }
  const randomColor = getRandomColor();
  function getInitials(username: string): string {
    const names = username.split(" ");
    return names
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  }
  return (
    <div
      className={`flex items-start gap-3 border-b py-3 cursor-pointer hover:bg-accent rounded`}
    >
      <Avatar className="w-10 h-10">
        {props.image ? (
          <AvatarImage src={props.image} />
        ) : (
          <AvatarFallback style={{ backgroundColor: randomColor }}>
            {getInitials(props.chatName)}
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className="text-2xl">{props.chatName}</h1>
    </div>
  );
}

export default ChatCard;
