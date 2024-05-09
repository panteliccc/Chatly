import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/contextMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatState } from "../..//Context/Provider";
import axios from "axios";
interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}
interface Props {
  user: User;
}
function InfoCard(props: Props) {
  const chatState = useChatState();
  const admin = chatState.selectedChat?.groupAdmins?.some(
    (admin) => admin._id === props.user._id
  );
  const authUser = props.user._id !== chatState.authUser?._id;

  const addAdmin = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/addGroupAdmin`,
        {
          chatId: chatState.selectedChat?._id,
          userId: props.user._id,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err: any) {
      console.error(err);
    }
  };
  const removeAdmin = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/removeGroupAdmin`,
        {
          chatId: chatState.selectedChat?._id,
          userId: props.user._id,
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
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center w-full border-b px-2 py-3 cursor-pointer gap-4">
        <Avatar className="w-10 h-10 rounded-full">
          {props.user?.image ? (
            <AvatarImage
              src={props.user?.image}
              className="w-full h-full rounded-full overflow-hidden"
            />
          ) : (
            <AvatarFallback className=" bg-[#272f37] text-xl">
              {props.user?.username[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl">{props.user.username}</h1>
          {admin ? <h2>Admin</h2> : <div></div>}
        </div>
      </ContextMenuTrigger>
      {chatState.selectedChat?.groupAdmins?.some(
        (admin: User) => admin._id === chatState.authUser?._id
      ) && (
        <ContextMenuContent className="rounded absolute right-0  bg-border left-0  w-60">
          {!admin ? (
            <ContextMenuItem
              className="py-3 px-5 cursor-pointer hover:bg-input"
              onClick={addAdmin}
            >
              Make Admin
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              className="py-3 px-5 cursor-pointer hover:bg-input"
              onClick={removeAdmin}
            >
              Remove Admin
            </ContextMenuItem>
          )}
          {authUser && (
            <ContextMenuItem className="py-3 px-5 cursor-pointer hover:bg-input">
              Remove User
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}

export default InfoCard;
