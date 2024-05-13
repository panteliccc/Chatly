import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/ui/tabs";
import { EditAccount } from "../Components/Settings/EditAccount";
import ChangePassword from "../Components/Settings/ChangePassword";
import DeleteAccount from "../Components/Settings/DeleteAccount";
import { ScrollArea } from "../Components/ui/scrollarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useChatState } from "../Context/Provider";
import axios from "axios";
function Settings() {
  const router = useNavigate();
  const chatState = useChatState();
  const [isTabsListHidden, setIsTabsListHidden] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width > 768) {
        setIsTabsListHidden(false);
        setIsContentOpen(true);
      } else {
        setIsTabsListHidden(false);
        setIsContentOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsTabsListHidden, setIsContentOpen]);

  const handleTabClick = () => {
    if (window.innerWidth < 768) {
      setIsTabsListHidden(true);
      setIsContentOpen(true);
    }
  };

  const handleBackClick = () => {
    if (window.innerWidth < 768) {
      setIsTabsListHidden(false);
      setIsContentOpen(false);
    }
  };
  async function handleLogout() {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/logout`);
      router("/Account/Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  return (
    <div className="bg-background h-screen w-screen">
      <Tabs
        defaultValue="account"
        className="w-screen flex items-start h-screen flex-col-reverse md:flex-row"
      >
        <TabsList
          className={`${
            isTabsListHidden ? "hidden" : ""
          } flex-col h-full justify-between w-screen bg-secondary md:w-5/12 xl:w-4/12 p-1 rounded-none `}
        >
          <div className="w-full">
            <div className="p-3 border-b mb-1 flex items-center gap-4 text-center ">
              <h1 className="text-2xl font-semibold text-white">Settings</h1>
            </div>
            <TabsTrigger
              value="account"
              className="w-full py-5 text-lg"
              onClick={() => {
                handleTabClick();
              }}
            >
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full py-5 text-lg"
              onClick={() => {
                handleTabClick();
              }}
            >
              Change Password
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className="w-full py-5 text-lg"
              onClick={() => {
                handleTabClick();
              }}
            >
              Delete Account
            </TabsTrigger>
          </div>
          <button
            className=" w-full p-5 bg-destructive rounded mt-7 text-white flex items-center justify-center gap-3 md:hidden "
            onClick={handleLogout}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className=" cursor-pointer"
            />
            Log Out
          </button>
        </TabsList>
        <div
          className={`${
            isContentOpen ? "flex w-screen" : "hidden w-0"
          } h-screen w-0 flex-col md:w-7/12 xl:w-8/12 md:flex p-1`}
        >
          <ScrollArea>
            <TabsContent value="account">
              <EditAccount handleBackClick={handleBackClick} />
            </TabsContent>
            <TabsContent value="password">
              <ChangePassword handleBackClick={handleBackClick} />
            </TabsContent>
            <TabsContent value="delete">
              <DeleteAccount handleBackClick={handleBackClick} />
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
