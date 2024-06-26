import { useEffect, useState } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import { useChatState } from "../../Context/Provider";
import { ScrollArea } from "../ui/scrollarea";
import Search from "./Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateGroup from "../createGroup";

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
  _id: string;
  user: User;
  text: string;
  createdAt: string;
  chat?: chat;
  isImage: boolean;
}
const SideBar = () => {
  const chatState = useChatState();
  const [isSearching, setIsSearching] = useState(false);
  const router = useNavigate();

  const getSender = (users: User[] | null | undefined): User | null => {
    const loggedUser = chatState.authUser;
    if (!users || users.length === 0) {
      return null;
    }

    const isSenderDeleted = users.some(
      (user) => user._id !== loggedUser?._id && user.isDeleted
    );

    if (isSenderDeleted) {
      return {
        _id: "",
        username: "Deleted User",
        email: "",
        image: "",
        isDeleted: true,
      };
    }

    const isSender = users[0]?._id === loggedUser?._id;
    const newSender = isSender ? users[1] : users[0];

    return newSender || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/getChats`,
          {
            withCredentials: true,
          }
        );

        chatState.setChats(data.chats);
        chatState.setAuthUser(data.authUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [chatState.refreshChats]);
  const handleStartChat = (chat: chat) => {
    router(`?chat=${chat._id}`);
    chatState.setSelectedChat(chat);
  };
  return (
    <div
      className={`bg-secondary h-screen ${
        chatState.visible ? "hidden w-0" : "flex w-screen"
      }  md:flex flex-col md:w-4/12  overflow-hidden`}
    >
      <Header />
      <Search setIsSearching={setIsSearching} />
      {chatState.chats && !isSearching ? (
        <ScrollArea>
          {chatState.chats &&
            chatState.chats.map((chat) => {
              const sender = getSender(chat.users);
              return (
                <div
                  onClick={() => {
                    handleStartChat(chat);
                  }}
                  key={chat._id}
                >
                  <ChatCard
                    _id={chat._id}
                    chatName={
                      chat.isGroup
                        ? chat.chatName
                        : (sender && sender.username) || ""
                    }
                    latestMessage={chat.latestMessage}
                    isGroup={chat.isGroup}
                    groupImage={chat.groupImage}
                    sender={sender}
                    className=""
                  />
                </div>
              );
            })}
        </ScrollArea>
      ) : (
        ""
      )}
      <CreateGroup />
    </div>
  );
};

export default SideBar;
