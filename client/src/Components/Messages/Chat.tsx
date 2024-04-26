import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessage from "./sendMessage";
import axios from "axios";
import { useChatState } from "../../Context/Provider";
import { Skeleton } from "../ui/skeleton";
import io from "socket.io-client";
interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}

interface Message {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
  chat?: Chat;
}
interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}

let socket: any;
let selectedChatCompare: Chat | null | undefined;

function Chat() {
  const location = useLocation();
  let chatId = new URLSearchParams(location.search).get("chat");
  const chatState = useChatState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const getChat = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5500/api/allMessages/${chatId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      chatState.setMessages(response.data);
      setLoading(false);

      socket.emit("join chat", chatId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(
    () => {
      getChat();
      selectedChatCompare = chatState.selectedChat;
    },
    chatState?.selectedChat ? [chatState?.selectedChat] : []
  );

  useEffect(() => {
    if (chatState.authUser && !socket) {
      socket = io("http://localhost:5500");
      socket.emit("setup", chatState.authUser);

      socket.on("connection", () => {
        setSocketConnected(true);
      });
    }
  });

  useEffect(() => {
    if (socket) {
      socket.on("message received", (newMessage: Message) => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessage.chat?._id
        ) {
          // NOTIFICATION
        } else {
          if (chatState?.messages != null) {
            chatState?.setMessages([...chatState?.messages, newMessage]);
          }
        }
      });
    }
  });
  return !loading ? (
    <div
      className={`h-screen ${
        chatState.visible ? "flex w-screen" : "hidden w-0"
      } flex-col md:w-7/12 xl:w-8/12 md:flex`}
    >
      {chatId ? (
        chatState.selectedChat && (
          <>
            <ChatHeader />
            <Messages />
            <SendMessage socket={socket} />
          </>
        )
      ) : (
        <div className="flex justify-center items-center h-full flex-col gap-3">
          <h1 className="text-5xl font-semibold">Chatly</h1>
          <p className="text-2xl">Start chat with your friends</p>
        </div>
      )}
    </div>
  ) : (
    <div className={`md:w-7/12 xl:w-8/12 h-screen flex flex-col gap-7 p-3`}>
      <Skeleton className="h-[58px] w-full bg-primary rounded" />
      <Skeleton className="h-full w-full bg-primary rounded" />
      <Skeleton className="h-[58px] w-full bg-primary rounded" />
    </div>
  );
}

export default Chat;
