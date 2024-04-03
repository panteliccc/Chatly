import { useEffect } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import axios from "axios";
import { useChatState } from "../../Context/Provider";

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
interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}
const SideBar = () => {
  const chatState = useChatState();
  const handleStartChat = async (id: string) => {
    try {
      const res = await axios.post<Chat>(
        "http://localhost:5500/api/createChat",
        {
          userId: id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
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
  if (!chatState.authUser || !chatState.chats) return <div>Loading...</div>;

  const getSender = (loggedUser: User | null, users: User[]) => {
    if (!users || users.length === 0) {
      return "";
    }
    const isSender = users[0]?._id === loggedUser?._id;
    return isSender ? users[0].username : users[1].username;
  };

  return (
    <div
      className={`px-3 bg-secondary h-screen w-screen flex flex-col md:w-1/3 lg:w-1/4 overflow-y-auto`}
    >
      <Header user={chatState.authUser} />
      {chatState.chats &&
        chatState.chats.map((chat) => (
          <ChatCard
            key={chat._id}
            _id={chat._id}
            chatName={
              chat.isGroup
                ? chat.chatName
                : getSender(chatState?.authUser, chat.users)
            }
            latestMessage={chat.latestMessage}
            className=""
          />
        ))}
    </div>
  );
};

export default SideBar;
