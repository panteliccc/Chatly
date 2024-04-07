import {useState } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import { useChatState } from "../../Context/Provider";
import { ScrollArea } from "../ui/scrollarea";
import Search from "./Search";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}

const SideBar = () => {
  const chatState = useChatState();
  const [isSearching, setIsSearching] = useState(false);


  if (!chatState.authUser || !chatState.chats) return <div>Loading...</div>;
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

  return (
    <div
      className={`bg-secondary h-screen w-screen flex flex-col md:w-5/12 xl:w-4/12  overflow-y-hidden overflow-x-hidden `}
    >
      <Header />
      <Search setIsSearching={setIsSearching} />
      {!isSearching ? (
        <ScrollArea>
          {chatState.chats &&
            chatState.chats.map((chat) => (
              <ChatCard
                key={chat._id}
                _id={chat._id}
                chatName={chat.isGroup ? chat.chatName : getSender(chat.users)}
                latestMessage={chat.latestMessage}
                className=""
              />
            ))}
        </ScrollArea>
      ) : (
        ""
      )}
    </div>
  );
};

export default SideBar;
