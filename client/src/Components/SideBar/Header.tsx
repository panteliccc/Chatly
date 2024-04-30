import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/popover";
import { Link } from "react-router-dom";
import { useChatState } from "../../Context/Provider";
function Header() {
  const chatState = useChatState();
  return (
    <div>
      <div className={`flex p-3 justify-between items-center border-b `}>
        <div className="flex items-center gap-2 h-10">
          <h2 className={`text-2xl font-semibold`}>Chatly</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="text-2xl cursor-pointer mr-1"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded absolute right-0 w-60 bg-border">
            <DropdownMenuItem className="text-lg cursor-pointer px-4">
              <Link to={"/Account/Settings"} className="w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-lg cursor-pointer px-4"
              onClick={() => chatState.setOpenCreateGroup(true)}
            >
              Create Group
            </DropdownMenuItem>
            <DropdownMenuSeparator className=" bg-white" />
            <DropdownMenuItem className="text-lg cursor-pointer px-4" onClick={()=> chatState.removeCookie("chatly.session-token")}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Header;
