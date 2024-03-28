import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function ChatCard() {
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
  console.log(randomColor);
  
  return (
    <div
      className={`flex items-start gap-3 border-b py-3 cursor-pointer hover:bg-accent rounded`}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src="" />
        <AvatarFallback style={{ backgroundColor: randomColor }}>N</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl">pantelicc</h1>
    </div>
  );
}

export default ChatCard;
