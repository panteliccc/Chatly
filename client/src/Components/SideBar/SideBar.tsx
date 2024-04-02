import { useEffect } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import axios from "axios";
import { useChatState } from "../../Context/Provider";

interface Users {
  _id: string;
  username: string;
  email: string;
  image: string;
}

const SideBar = () => {
  const chatState = useChatState();
  const handleStartChat = async (id: string) => {
    try {
      const res = await axios.post(
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
  }, [chatState]);
  if (!chatState.authUser) return <div>Loading...</div>;

  const getSenderIndex = (authUsername: string, users: Users[]): number => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username !== authUsername) {
        return i;
      }
    }
    return -1;
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
                : (chatState.authUser?.username &&
                    chat.users[
                      getSenderIndex(
                        chatState.authUser?.username || "",
                        chat.users
                      )
                    ]?.username) ||
                  ""
            }
            image={chat.users[1]?.image}
            latestMessage={chat.latestMessage}
            userId={
              chat.users[
                getSenderIndex(chatState.authUser?.username || "", chat.users)
              ]?._id
            }
            onClick={() =>
              handleStartChat(
                chat.users[
                  getSenderIndex(chatState.authUser?.username || "", chat.users)
                ]?._id
              )
            }
            className=""
          />
        ))}
    </div>
  );
};

export default SideBar;
