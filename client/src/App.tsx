import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Register } from "./Pages/register";
import { Login } from "./Pages/login";
import Home from "./Pages/Home";
import { CookiesProvider, useCookies } from "react-cookie";

function App() {
  const [cookie, setCookie,removeToken] = useCookies(["chatly.session-token"]);
  
  const router = useNavigate();
  const logOut = ()=>{
    removeToken("chatly.session-token");
    router("/Account/Login");
    
  }
  return (
    <CookiesProvider>
      <div className={`bg-softBlue h-screen `}>
        <div className={`h-screen flex justify-center items-center `}>
          <Routes>
            <Route path="/" element={<Home cookie={cookie} removeToken={logOut}/> } />
            <Route path="/Account/Login" element={<Login setCookie={setCookie} />} />
            <Route path="/Account/Register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </CookiesProvider>
  );
}

export default App;
