import { useEffect, useState } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import { useChatState } from "../../Context/Provider";
import { ScrollArea } from "../ui/scrollarea";
import Search from "./Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from "../Messages/Chat";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}
interface chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}
interface Message {
  _id:string;
  user: User;
  text: string;
  createdAt:string;
  chat?:chat;
}
const SideBar = () => {
  const chatState = useChatState();
  const [isSearching, setIsSearching] = useState(false);
  const router = useNavigate();
  const getSender = (users: User[]) => {
    const loggedUser = chatState.authUser;
    if (!users || users.length === 0) {
      return "";
    }

    const isSenderDeleted = users.some(
      (user) => user._id !== loggedUser?._id && user.isDeleted
    );

    if (isSenderDeleted) {
      return "Deleted user";
    }

    const isSender = users[0]?._id === loggedUser?._id;
    return isSender ? users[1].username : users[0]?.username || "Deleted user";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/api/getChats", {
          withCredentials: true,
        });

        chatState.setChats(data.chats);
        chatState.setAuthUser(data.authUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  

  const handleStartChat = (chat: chat) => {
    router(`?chat=${chat._id}`);
    chatState.setSelectedChat(chat)
  };
  return (
    <div
      className={`bg-secondary h-screen ${chatState.visible?'hidden w-0':'flex w-screen'}  md:flex flex-col md:w-5/12 xl:w-4/12  overflow-hidden`}
    >
      <Header />
      <Search setIsSearching={setIsSearching} />
      {chatState.chats && !isSearching ? (
        <ScrollArea>
          {chatState.chats &&
            chatState.chats.map((chat) => (
              <div
                onClick={() => {
                  handleStartChat(chat);
                }}
                key={chat._id}
              >
                <ChatCard
                  _id={chat._id}
                  chatName={
                    chat.isGroup ? chat.chatName : getSender(chat.users)
                  }
                  latestMessage={chat.latestMessage}
                  isGroup={chat.isGroup}
                  className=""
                />
              </div>
            ))}
        </ScrollArea>
      ) : (
        ""
      )}
    </div>
  );
};

export default SideBar;
