import { useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { useChatState } from "../../Context/Provider";
import SearchResults from "./SearchResults";
import { useNavigate } from "react-router-dom";

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
  username?: string;
  email: string;
  image: string;
  latestMessage: Message;
  chatName?:string;
  isGroup?:boolean;
}
interface Chat {
  _id: string;
  chatName: string;
  isGroup: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin?:User;
}

interface Props {
  setIsSearching: (isSearching: boolean) => void;
}

function Search({ setIsSearching }: Props) {
  const chatState = useChatState();
  const router = useNavigate();
  const [searchValue, setValueSearch] = useState("");
  const [visible, setVisible] = useState("hidden");

  const fetchData = async (searchValue: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/search`,
        { search: searchValue }, 
        {
          withCredentials: true,
        }
      );
      chatState.setSearchResults(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartChat = async (id: string) => {
    try {
      const { data } = await axios.post<Data>(
        `${process.env.REACT_APP_SERVER_URL}/api/createChat`,
        {
          userId: id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const elementExists = chatState.chats?.some(
        (item) => item._id === data._id
      );
      if (!elementExists) {
        chatState?.setChats((prev: Chat[]) => [data, ...prev]);
      } else {
        router(`?chat=${data._id}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setVisible("hidden");
      setValueSearch("");
      setIsSearching(false);
    }
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.trim() !== "") {
      setVisible("flex");
      setIsSearching(true);
    } else {
      setVisible("hidden");
      setIsSearching(false);
    }

    setValueSearch(value);
    fetchData(value);
  };

  return (
    <div className="w-full max-h-full flex flex-col">
      <div className="px-3">
        <div className="flex p-2 my-3 rounded bg-input">
          <img src="/search.svg" alt="search icon" className="w-5" />
          <Input
            type="search"
            placeholder="Search people...."
            className="shadow-none focus-visible:ring-0 border-0 "
              onChange={handleChangeSearch}
              value={searchValue}
          />
        </div>
      </div>
      <SearchResults handleStartChat={handleStartChat} visible={visible} />
    </div>
  );
}

export default Search;