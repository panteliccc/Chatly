import React, { useEffect, useState } from "react";
import Header from "./Header";
import ChatCard from "./ChatCard";
import axios from "axios";

interface Data {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: Users[];
  latestMessage: Message;
}
interface Message {
  sender: Users;
  content: string;
}
interface Users {
  _id: string;
  username: string;
  email: string;
  image: string;
}

const SideBar = (props:any) => {
  const [data, setData] = useState<Data[]>([]);
  const [authUser, setAuthUser] = useState<{
    username: string;
    email: string;
    image:string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5500/api/getChats", {
          withCredentials: true,
        });
        setData(data.chats);
        setAuthUser(data.authUser);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  if (!authUser) return <div>Loading...</div>;

  const getSender = (authUsername: string, users: Users[]): string => {
    const sender = users.find(user => user.username !== authUsername);
    return sender ? sender.username : "Unknown User";
  };
  return (
    <div
      className={`px-3 bg-secondary h-screen w-screen flex flex-col md:w-1/3 lg:w-1/4 overflow-y-auto`}
    >
      <Header user={authUser} logOut={props.logOut}/>
      {data.map((chat) => (
        <ChatCard
          key={chat._id}
          _id={chat._id}
          chatName={
            chat.isGroup?chat.chatName:(authUser.username && getSender(authUser.username,chat.users))
          }
          image={chat.users[1].image}
          latestMessage={chat.latestMessage}
          className=""
        />
      ))} 
    </div>
  );
};

export default SideBar;