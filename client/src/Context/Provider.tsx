import React from "react";
import { createContext, useContext, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}

interface ChatContextType {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
  selectedChat: Chat | null;
  setSelectedChat: (selectedChat: Chat | null) => void;
  chats: Chat[] | null;
  setChats: any;
  cookie: any;
  setCookie: any;
  removeCookie: any;
  activeLink: string | null;
  setActiveLink: any;
  searchResults: Data[] | null;
  setSearchResults: any;
}

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface Message {
  sender: User;
  content: string;
}
interface Data {
  _id: string;
  username: string;
  email: string;
  image: string;
  latestMessage: Message;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchResults, setSearchResults] = useState<Data[] | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [cookie, setCookie, removeCookie] = useCookies([
    "chatly.session-token",
  ]);
  const [activeLink, setActiveLink] = useState<string | null>("messages");

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        authUser,
        setAuthUser,
        setChats,
        chats,
        cookie,
        setCookie,
        removeCookie,
        activeLink,
        setActiveLink,
        searchResults,
        setSearchResults,
      }}
    >
      <CookiesProvider>{children}</CookiesProvider>
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
