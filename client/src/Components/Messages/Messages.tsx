import { useChatState } from "../../Context/Provider";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import Message from "./Message";

function Messages() {
  const chatState = useChatState();
  const { messages } = chatState;

  let prevSender: string | null = null;

  console.log(messages);
  
  return (
    <ScrollableFeed className="h-full flex flex-col gap-1 p-3">
      {messages && messages.map((message, index) => {
        const sameSender = message.user._id === prevSender;
        prevSender = message.user._id; 

        return (
          <Message
            key={index}
            sender={true}
            text={message.text}
            showIcon={!sameSender} 
          />
        );
      })}
    </ScrollableFeed>
  );
}

export default Messages;
