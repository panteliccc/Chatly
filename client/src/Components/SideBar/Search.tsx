import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import ChatCard from "./ChatCard";

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

function Search() {
  const [data, setData] = useState<Data[]>([]);
  const [searchValue, setValueSearch] = useState("");
  const [visible, setVisibe] = useState("hidden");
  const fetchData = async (searchValue:string) => {
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
  useEffect(() => {
    fetchData(searchValue);
    if (searchValue !== "") {
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
        className={`bg-popover flex-col p-3 absolute z-20 w-full rounded max-h-64 overflow-auto shadow-xl ${visible}`}
      >
        {data.length === 0 ? (
          <div>No results found</div>
        ) : (
          data.map((user) => (
            <ChatCard
              key={user._id}
              _id={user._id}
              chatName={user.username}
              image={user.image}
              latestMessage={user.latestMessage}
              className=" hover:bg-transparent border-b-0"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Search;
