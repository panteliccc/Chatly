import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessage from "./sendMessage";
import axios from "axios";
import { useChatState } from "../../Context/Provider";
import { Skeleton } from "../ui/skeleton";

function Chat() {
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");
  const chatState = useChatState();
  const [loading, setLoading] = useState(false);

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
      const chatData = response.data.chat[0];
      chatState.setSelectedChat(chatData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChat();
    }
  }, [chatId]);

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
            <SendMessage />
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
    <div
      className={`md:w-7/12 xl:w-8/12 h-screen flex flex-col gap-7 p-3`}
    >
      <Skeleton className="h-[58px] w-full bg-primary rounded" />
      <Skeleton className="h-full w-full bg-primary rounded" />
      <Skeleton className="h-[58px] w-full bg-primary rounded" />
    </div>
  );
}

export default Chat;
