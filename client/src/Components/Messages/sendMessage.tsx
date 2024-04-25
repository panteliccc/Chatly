import React, { useState } from "react";
import { Input } from "../ui/input";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useChatState } from "../../Context/Provider";
interface Message {
  user: User;
  text: string;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}

function SendMessage() {
  const chatState = useChatState();
  const [message, setMessage] = useState("");
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");

  const sendMessage = async () => {
    if (message.trim() === "") {
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5500/api/sendMessage",
        {
          text: message,
          chat: chatId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const newMessage: Message = {
        user: data.user,
        text: data.text,
        createdAt: data.createdAt,
      };
      
      chatState.setMessages((prev: Message[]) => {
        return [...prev, newMessage];
      });
      

      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="p-3 bg-primary flex gap-3">
      <Input
        placeholder="Message..."
        className=" rounded bg-secondary py-7 px-3 shadow-none focus-visible:ring-0 border-0"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyDown={(e) => {
          onKeyDown(e);
        }}
      />

      <button
        className="w-16 bg-softBlue md:flex items-center justify-center rounded hidden"
        onClick={sendMessage}
      >
        <img src="/send.svg" alt="" />
      </button>
    </div>
  );
}

export default SendMessage;
