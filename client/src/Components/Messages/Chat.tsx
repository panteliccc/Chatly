import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessage from "./sendMessage";
import axios from "axios";
import { useChatState } from "../../Context/Provider";

function Chat() {
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");
  const chatState = useChatState();

  const getChat = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/allMessages/${chatId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const chatData = response.data.chat[0];
      chatState.setSelectedChat(chatData);
      console.log(chatData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChat();
    }
  }, [chatId]);

  return (
    <div className="h-screen w-0 hidden flex-col md:w-7/12 xl:w-8/12 md:flex">
      {chatState.selectedChat && (
        <>
          <ChatHeader />
          <Messages />
          <SendMessage />
        </>
      )}
    </div>
  );
}

export default Chat;
