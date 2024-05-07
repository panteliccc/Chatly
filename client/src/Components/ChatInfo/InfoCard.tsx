import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/contextMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatState } from "../..//Context/Provider";
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
  const chatSate = useChatState();
  const admin = props.user._id === chatSate.selectedChat?.groupAdmin?._id;
  const authUser = props.user._id !== chatSate.authUser?._id;
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
      {chatSate.authUser?._id == chatSate.selectedChat?.groupAdmin?._id && (
        <ContextMenuContent className="rounded absolute right-0  bg-border left-0  w-60">
          {!admin ? (
            <ContextMenuItem className="py-3 px-5 cursor-pointer hover:bg-input">
              Make Admin
            </ContextMenuItem>
          ) : (
            <ContextMenuItem className="py-3 px-5 cursor-pointer hover:bg-input">
              Remove Admin
            </ContextMenuItem>
          )}
          {authUser ? (
            <ContextMenuItem className="py-3 px-5 cursor-pointer hover:bg-input">
              Remove User
            </ContextMenuItem>
          ) : (
            <ContextMenuItem className="py-3 px-5 cursor-pointer hover:bg-input">
              Transfer Ownership
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}

export default InfoCard;
