import React, { useEffect } from "react";
import SideBar from "../Components/SideBar/SideBar";
import Chat from "../Components/Chat";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home(props:any) {
  const router = useNavigate();

  useEffect(() => {
    const token = props.cookie["chatly.session-token"];
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
  }, [props.cookie, router]);

  const isTokenExpired = (token: string) => {
    const { exp } = jwtDecode(token);
    return Date.now() >= (exp ? exp * 1000 : 0);
  };


  return (
    <div className={`bg-background w-screen h-screen flex`}>
      <SideBar logOut={props.removeToken}/>
      <Chat />
    </div>
  );
}

export default Home;
