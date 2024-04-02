import React from "react";
import { Route, Routes } from "react-router-dom";
import { Register } from "./Pages/register";
import { Login } from "./Pages/login";
import Home from "./Pages/Home";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
      <div className={`bg-softBlue h-screen `}>
        <div className={`h-screen flex justify-center items-center `}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Account/Login" element={<Login />} />
            <Route path="/Account/Register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </CookiesProvider>
  );
}

export default App;
