import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import ChatCard from "./ChatCard";
import { useChatState } from "../../Context/Provider";

interface Data {
  _id: string;
  username: string;
  email: string;
  image: string;
  latestMessage: Message;
}
interface Message {
  sender: Data;
  content: string;
}
interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}
interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

function Search() {
  const chatSate = useChatState();
  const [data, setData] = useState<Data[]>([]);
  const [searchValue, setValueSearch] = useState("");
  const [visible, setVisibe] = useState("hidden");
  const fetchData = async (searchValue: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5500/api?search=${searchValue}`,
        {
          withCredentials: true,
        }
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleStartChat = async (id: string) => {
    try {
      const { data }: { data: Chat } = await axios.post(
        "http://localhost:5500/api/createChat",
        {
          userId: id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const elementExists = chatSate.chats?.some(item=>item._id===data._id)
      if(!elementExists){
        chatSate?.setChats((prev: Chat[]) => [...prev, data]);
      }
      
      
    } catch (err) {
      console.log(err);
    } finally {
      setVisibe("hidden");
      setValueSearch("");
    }
  };
  useEffect(() => {
    fetchData(searchValue);
    if (searchValue.trim() !== "") {
      setVisibe("flex");
    } else {
      setVisibe("hidden");
    }
  }, [searchValue]);
  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full relative">
      <div className="flex p-2 border my-3 rounded">
        <img src="/search.svg" alt="search icon" className={`w-5`} />
        <Input
          type="search"
          placeholder="Search people...."
          className="shadow-none focus-visible:ring-0 border-0"
          onChange={(e) => setValueSearch(e.target.value)}
          value={searchValue}
        />
      </div>
      <div
        className={`bg-popover flex-col p-3 absolute z-20 w-full rounded max-h-72 overflow-auto shadow-xl ${visible}`}
      >
        {data.length === 0 ? (
          <div>No results found</div>
        ) : (
          data.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                handleStartChat(user._id);
              }}
            >
              <ChatCard
                _id={user._id}
                chatName={user.username}
                latestMessage={user.latestMessage}
                className=" hover:bg-transparent"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;