import axios from "axios";
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin?:User;
}

interface ChatContextType {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
  selectedChat: Chat | null;
  setSelectedChat: (selectedChat: Chat | null) => void;
  messages: Message[] | null;
  setMessages: any;
  chats: Chat[] | null;
  setChats: any;
  cookie: any;
  setCookie: any;
  removeCookie: any;
  activeLink: string | null;
  setActiveLink: any;
  searchResults: Data[] | null;
  setSearchResults: any;
  visible: any;
  setVisible:any;
  refreshChats: any;
  setRefreshChats:any;
  openInfo: any;
  setOpenInfo:any;  
  openCreateGroup: any;
  setOpenCreateGroup:any;
  image:any;
  setImage:any;
  imageView:any;
  setImageView:any;
  visibleImage:any;
  setVisibleImage:any;
}

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}

interface Message {
  _id:string;
  user: User;
  text: string;
  createdAt:string;
  chat?:Chat;
  isImage:boolean;
}
interface Data {
  _id: string;
  username?: string;
  email: string;
  image: string;
  latestMessage: Message;
  chatName?:string;
  isGroup?:boolean;
}
const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [searchResults, setSearchResults] = useState<Data[] | null>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [cookie, setCookie, removeCookie] = useCookies([
    "chatly.session-token",
  ]);
  const [activeLink, setActiveLink] = useState<string | null>("messages");
  const [visible, setVisible] = useState(false);
  const [refreshChats,setRefreshChats] = useState(false)
  const [openInfo, setOpenInfo] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [visibleImage, setVisibleImage] = useState(false);
  const [imageView, setImageView] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/api/getChats", {
          withCredentials: true,
        });

        setChats(data.chats);
        setAuthUser(data.authUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
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
        visible,
        setVisible,
        refreshChats,
        setRefreshChats,
        openInfo,
        setOpenInfo,
        openCreateGroup,
        setOpenCreateGroup,
        image, 
        setImage,
        imageView,
        setImageView,
        visibleImage,
        setVisibleImage
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
