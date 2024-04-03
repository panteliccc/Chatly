import React from "react";
import { Route, Routes } from "react-router-dom";
import { Register } from "./Pages/register";
import { Login } from "./Pages/login";
import Home from "./Pages/Home";
import { CookiesProvider } from "react-cookie";
import Settings from "./Pages/Settings";

function App() {
 /* const router = useNavigate();
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
  }; */
  return (
    <CookiesProvider>
      <div className={`bg-softBlue h-screen `}>
        <div className={`h-screen flex justify-center items-center `}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Account/Login" element={<Login />} />
            <Route path="/Account/Register" element={<Register />} />
            <Route path="/Account/Settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </CookiesProvider>
  );
}

export default App;
