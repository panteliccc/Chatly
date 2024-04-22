import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Input } from "./ui/input";
import axios from "axios";
import ChatCard from "./SideBar/ChatCard";
import { ScrollArea } from "./ui/scrollarea";
import { useChatState } from "../Context/Provider";

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
interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
}
function CreateGroup() {
  const [searchValue, setValueSearch] = useState("");
  const [chatName, setChatName] = useState("");
  const [visible, setVisible] = useState("hidden");
  const [data, setData] = useState<Data[] | null>(null);
  const [people, setPeople] = useState<User[]>([]);
  const chatSate = useChatState();

  const fetchData = async (searchvalue: string) => {
    try {
      const { data } = await axios.get<Data[]>(
        `http://localhost:5500/api?search=${encodeURIComponent(searchvalue)}`,
        {
          withCredentials: true,
        }
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.trim() !== "") {
      setVisible("flex");
    } else {
      setVisible("hidden");
    }
    setValueSearch(value);
    fetchData(value);
  };

  const handleUserClick = (user: User) => {
    if (!people.some((people) => people._id === user._id)) {
      setPeople((prevPeople) => [...prevPeople, user]);
      setValueSearch("");
      setVisible("hidden");
    }
  };
  const handleRemoveUser = (userId: string) => {
    setPeople((prevPeople) => prevPeople.filter((user) => user._id !== userId));
  };

  const CreateGroupChat = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5500/api/createGroupChat",
        {
          chatName,
          users: people,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const elementExists = chatSate.chats?.some(
        (item) => item._id === data._id
      );
      if (!elementExists) {
        chatSate?.setChats((prev: Chat[]) => [data, ...prev]);
      }
      setChatName("");
      setPeople([]);
      setValueSearch("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Sheet>
      <SheetTrigger>
        <FontAwesomeIcon icon={faUserGroup} />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-screen max-w-none sm:max-w-none md:w-1/3 border-0"
      >
        <SheetHeader className="flex">
          <SheetTitle>New Group Chat</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col w-full gap-3">
          <form className="pt-5 flex flex-col gap-5">
            <Input
              placeholder="Group Name"
              className="rounded"
              onChange={(e) => setChatName(e.target.value)}
              value={chatName}
            />
            <Input
              type="search"
              placeholder="Add people"
              className="rounded"
              onChange={handleChangeSearch}
              value={searchValue}
            />
            <ScrollArea className={`max-h-60 w-full  flex flex-col ${visible}`}>
              {data?.length !== 0 ? (
                data &&
                data.map((user: Data) => (
                  <div key={user._id} onClick={() => handleUserClick(user)}>
                    <ChatCard
                      _id={user._id}
                      chatName={user.username}
                      latestMessage={user.latestMessage}
                      className=""
                    />
                  </div>
                ))
              ) : (
                <div className="p-3">No results found</div>
              )}
            </ScrollArea>
          </form>
          <div className="flex gap-2 w-full flex-wrap">
            {people.map((user: User) => (
              <div
                key={user._id}
                className=" bg-ring rounded flex items-center gap-3"
              >
                <h1 className=" px-3 pr-0 text-xl">{user.username}</h1>

                <FontAwesomeIcon
                  icon={faXmark}
                  className="text-xl p-3 bg-primary cursor-pointer rounded-r"
                  onClick={() => handleRemoveUser(user._id)}
                />
              </div>
            ))}
          </div>
          <SheetClose>
            <button
              className=" bg-input w-full  p-3 rounded"
              onClick={CreateGroupChat}
            >
              Create Group
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateGroup;
