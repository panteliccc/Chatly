import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Register } from "./Pages/register";
import { Login } from "./Pages/login";
import Home from "./Pages/Home";
import { CookiesProvider } from "react-cookie";
import Settings from "./Pages/Settings";
import { useChatState } from "./Context/Provider";
import axios from "axios";

function App() {
  const chatState = useChatState();

  useEffect(() => {
    checkAuth();
  }, [chatState.auth]);
  const router = useNavigate();
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/checkAuth`,
        {
          withCredentials: true,
        }
      );
      chatState.setAuth(res.data.access);
    } catch (err: any) {
      router("/Account/Login");
    }
  };
  return (
    <CookiesProvider>
      <div className={`bg-softBlue h-screen `}>
        <div className={`h-screen flex justify-center items-center `}>
          <Routes>
            {chatState.auth && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/Account/Settings" element={<Settings />} />
              </>
            )}
            <Route path="/Account/Login" element={<Login />} />
            <Route path="/Account/Register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </CookiesProvider>
  );
}

export default App;
