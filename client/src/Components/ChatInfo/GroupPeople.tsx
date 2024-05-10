import { useChatState } from "../../Context/Provider";
import React, { useState } from "react";
import InfoCard from "./InfoCard";
import { Input } from "../ui/input";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}
function GroupPeople() {
  const chatState = useChatState();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const isOnlyAdmin =
    chatState.selectedChat?.groupAdmins?.length === 1 &&
    chatState.selectedChat?.groupAdmins?.[0]._id === chatState.authUser?._id;

  const fetchData = async (searchValue: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/searchUser`,
        { search: searchValue, chatId: chatState.selectedChat?._id },
        { withCredentials: true }
      );
      setResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (e: any) => {
    const { value } = e.target;
    setSearchValue(value);
    if (value.trim() !== "") {
      setIsSearching(true);
      fetchData(value);
    } else {
      setIsSearching(false);
    }
  };
  const addUser = async (userId: string) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/addUser`,
        {
          chatId: chatState.selectedChat?._id,
          userId,
        },
        {
          withCredentials: true,
        }
      );
      setIsSearching(false);
      setSearchValue("");
    } catch (err: any) {
      console.error(err);
    }
  };

  const leaveGroup = async () => {
    if (isOnlyAdmin) return setOpenDialog(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/removeUserAndLeaveGroup`,
        {
          chatId: chatState.selectedChat?._id,
          userId: chatState.authUser?._id,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <div className="border-t p-2">
      <div className="flex gap-3 items-center">
        {!isSearching && <h1 className="text-xl">Members</h1>}

        <Input
          placeholder="Search members.."
          className="shadow-none focus-visible:ring-0 border-0 bg-[#272f37] rounded"
          onChange={handleChangeSearch}
          value={searchValue}
        />
      </div>
      {isSearching ? (
        <div className="py-4">
          <h1>Add people</h1>
          <div>
            {results.length === 0 ? (
              <div className="p-3">No results found</div>
            ) : (
              <div>
                {results.map((user) => (
                  <div
                    className="flex items-center gap-5 px-2 py-3 border-b cursor-pointer"
                    onClick={() => addUser(user._id)}
                  >
                    <Avatar className="w-10 h-10 rounded-full">
                      {user?.image ? (
                        <AvatarImage
                          src={user?.image}
                          className="w-full h-full rounded-full overflow-hidden"
                        />
                      ) : (
                        <AvatarFallback className=" bg-[#272f37] text-xl">
                          {user?.username[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h1 className="text-2xl">{user.username}</h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {chatState.selectedChat?.isGroup && chatState.selectedChat.users ? (
            chatState.selectedChat.users.map((user) => (
              <InfoCard user={user} key={user._id} />
            ))
          ) : (
            <></>
          )}
          <button className="mt-5 text-2xl text-[#fc0330]" onClick={leaveGroup}>
            Leave Group
          </button>
        </div>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader className="border-0 ring-0 shadow-none outline-0">
            <DialogTitle className=" text-[#fc0330]">Leaving the Group</DialogTitle>
            <DialogDescription>
              You are the only administrator in this group. In order to leave,
              you need to transfer the administrator role to another member.
              Please assign a new administrator before leaving the group
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GroupPeople;
