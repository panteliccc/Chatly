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
import Menu from "../Components/Menu";

function Settings() {
  const [isTabsListHidden, setIsTabsListHidden] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [headerText, setHeaderText] = useState("Edit Profile");
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

  return (
    <div className="bg-background h-screen w-screen">
      <Tabs
        defaultValue="account"
        className="w-screen flex items-start h-screen flex-col-reverse md:flex-row"
      >
        <Menu />
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
                setHeaderText("Edit Profile");
              }}
            >
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full py-5 text-lg"
              onClick={() => {
                handleTabClick();
                setHeaderText("Change Password");
              }}
            >
              Change Password
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className="w-full py-5 text-lg"
              onClick={() => {
                handleTabClick();
                setHeaderText("Delete Acoount");
              }}
            >
              Delete Account
            </TabsTrigger>
          </div>
        </TabsList>
        <div
          className={`${
            isContentOpen ? "flex w-screen" : "hidden w-0"
          } h-screen w-0 flex-col md:w-6/12 xl:w-7/12 md:flex p-1`}
        >
          <div className="py-3 border-b mb-1 flex items-center gap-4 text-center w-full">
            <img
              src={`/arrow-left-solid.svg`}
              alt="login ilustration"
              className=" w-5 md:hidden flex"
              onClick={handleBackClick}
            />
            <h1 className="text-2xl font-semibold text-white">{headerText}</h1>
          </div>
          <TabsContent value="account" className=" py-14">
            <EditAccount />
          </TabsContent>
          <TabsContent value="password">
            <ChangePassword />
          </TabsContent>
          <TabsContent value="delete">
            <DeleteAccount />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
