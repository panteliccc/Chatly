import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/popover";
import Search from "./Search";

interface Props {
  user: User;
  logOut: any;
}
interface User {
  username: string;
  email: string;
  image: string;
}
function getInitials(username: string): string {
  const names = username.split(" ");
  return names
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
}
function Header(props: Props) {
  return (
    <div className="">
      <div className={`flex py-3 justify-between items-center border-b-2`}>
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            {props.user.image ? (
              <AvatarImage src={props.user.image} />
            ) : (
              <AvatarFallback>
                {getInitials(props.user.username)}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className={`text-2xl font-semibold`}>Chats</h2>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-text rounded-full"></div>
                <div className="w-1 h-1 bg-text rounded-full"></div>
                <div className="w-1 h-1 bg-text rounded-full"></div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" absolute right-0 rounded w-44 mt-2">
              <DropdownMenuLabel>{props.user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded cursor-pointer">
                New Group
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded cursor-pointer"
                onClick={props.logOut}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Search />
    </div>
  );
}

export default Header;
