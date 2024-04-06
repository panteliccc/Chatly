import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useChatState } from "../Context/Provider";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import {
  faGear,
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

function Menu() {
  const chatState = useChatState();
  const location = useLocation();

  function isLinkActive(path: string) {
    return location.pathname === path;
  }

  function getInitials(username: string): string {
    if (!username) return "";
    const names = username.split(" ");
    return names
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
  }

  return (
    <div className="h-auto p-3 bg-background w-full flex items-center flex-col justify-between md:w-1/12 md:h-screen lg:w-auto">
      <div className=" flex items-center flex-col gap-14">
        <Avatar className="w-10 h-14 hidden md:flex">
          {chatState.authUser?.image ? (
            <AvatarImage
              src={chatState.authUser?.image}
              className="w-full h-full rounded-full overflow-hidden"
            />
          ) : (
            <AvatarFallback className="w-full h-full  bg-secondary flex justify-center items-center rounded-full">
              {getInitials(
                chatState.authUser?.username ? chatState.authUser?.username : ""
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <ul className="flex justify-center items-center w-screen h-full md:flex-col md:gap-10 md:w-full">
          <li
            className={` w-1/4 p-2 flex items-center justify-center rounded-full md:w-full ${
              isLinkActive("/") ? "bg-softBlue" : ""
            }`}
          >
            <Link to={"/"} onClick={() => chatState.setActiveLink("messages")}>
              <FontAwesomeIcon icon={faMessage} className="w-full" />
            </Link>
          </li>
          <li
            className={` w-1/4 p-2 flex items-center justify-center rounded-full md:w-full ${
                isLinkActive("/Account/Settings") ? "bg-softBlue" : ""
            }`}
          >
            <Link
              to={"/Account/Settings"}
              onClick={() => chatState.setActiveLink("settings")}
            >
              <FontAwesomeIcon icon={faGear} />
            </Link>
          </li>
          <li
            className={` w-1/4 p-2 flex items-center justify-center rounded-full md:w-full ${
                isLinkActive("/Create/Group") ? "bg-softBlue" : ""
            }`}
          >
            <Link to={"/"} onClick={() => chatState.setActiveLink("usergroup")}>
              <FontAwesomeIcon icon={faUserGroup} />
            </Link>
          </li>
        </ul>
      </div>
      <FontAwesomeIcon
        icon={faRightFromBracket}
        className=" cursor-pointer hidden md:flex"
        onClick={chatState.removeCookie["chatly.session-token"]}
      />
    </div>
  );
}

export default Menu;
