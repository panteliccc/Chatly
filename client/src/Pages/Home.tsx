import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useChatState } from "../Context/Provider";
import SideBar from "../Components/SideBar/SideBar";
import Chat from "../Components/Messages/Chat";
import ChatInfo from "../Components/ChatInfo/ChatInfo";

function Home(props: any) {
  const router = useNavigate();
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");
  const chatState = useChatState();

  useEffect(() => {
    const token = chatState?.cookie["chatly.session-token"];
    if (token) {
      try {
        const user = jwtDecode(token);
        if (!user || isTokenExpired(token)) {
          router("/Account/Login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router("/Account/Login");
      }
    } else {
      router("/Account/Login");
    }
  }, [chatState.cookie, router]);

  const isTokenExpired = (token: string) => {
    const { exp } = jwtDecode(token);
    return Date.now() >= (exp ? exp * 1000 : 0);
  };

  useEffect(() => {


    if (chatId) {
      chatState.setVisible(true)
      fetchChatById(chatId);
    }
  }, [chatId]);

  const fetchChatById = async (chatId: string) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getChatById/${chatId}`,{
        withCredentials: true,
      });
      chatState.setSelectedChat(data);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  return (
    <div className={`bg-background w-screen h-screen flex flex-col-reverse md:flex-row`}>
      <SideBar/>
      <Chat />
      <ChatInfo/>
    </div>
  );
}

export default Home;
