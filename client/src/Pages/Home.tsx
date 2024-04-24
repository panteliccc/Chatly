import React, { useEffect } from "react";
import SideBar from "../Components/SideBar/SideBar";
import Chat from "../Components/Messages/Chat";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useChatState } from "../Context/Provider";
import Menu from "../Components/Menu";

function Home(props:any) {
    const router = useNavigate();
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
    const location = useLocation();
    const chatId = new URLSearchParams(location.search).get("chat");
    useEffect(()=>{
      if(chatId) chatState.setVisible(true)
    },[chatId])

    
  return (
    <div className={`bg-background w-screen h-screen flex flex-col-reverse md:flex-row`}>
      <Menu />
      <SideBar/>
      <Chat />

    </div>
  );
}

export default Home;
