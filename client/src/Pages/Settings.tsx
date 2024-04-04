import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/ui/tabs";
import { Link } from "react-router-dom";

function Settings() {
  const [isTabsListHidden, setIsTabsListHidden] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [headerText, setHeaderText] = useState("Edite Profile")
  const [, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width > 640) {
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
    if (window.innerWidth < 640) {
      setIsTabsListHidden(true);
      setIsContentOpen(true);
    }
  };

  const handleBackClick = () => {
    if (window.innerWidth < 640) {
      setIsTabsListHidden(false);
      setIsContentOpen(false);
    }
  };

  return (
    <div className="bg-background h-screen w-screen">
      <Tabs
        defaultValue="account"
        className="w-screen flex items-start h-screen"
      >
        <TabsList
          className={`${
            isTabsListHidden ? "hidden" : ""
          } flex-col h-full justify-between w-screen bg-secondary sm:w-1/3 lg:w-1/4 p-1`}
        >
          <div className="w-full">
            <div className="p-3 border-b mb-1 flex items-center gap-4 text-center ">
              <Link to={"/"}>
                <img
                  src={`/arrow-left-solid.svg`}
                  alt="login ilustration"
                  className="w-5"
                />
              </Link>
              <h1 className="text-2xl font-semibold text-white">Settings</h1>
            </div>
            <TabsTrigger
              value="account"
              className="w-full py-5 text-lg"
              onClick={()=>{
                handleTabClick()
                setHeaderText("Edit Profile")
              }}
            >
              Edit Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full py-5 text-lg"
              onClick={()=>{
                handleTabClick()
                setHeaderText("Change Password")
              }}
            >
              Change Password
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className="w-full py-5 text-lg"
              onClick={()=>{
                handleTabClick()
                setHeaderText("Delete Acoount")
              }}
            >
              Delete Account
            </TabsTrigger>
          </div>
          <button className="w-full py-5 text-xl bg-background rounded text-destructive font-bold ">
            Log Out
          </button>
        </TabsList>
        <div
          className={`${
            isContentOpen ? "flex w-screen" : "hidden w-0"
          } h-screen w-0 flex-col sm:w-2/3 sm:flex lg:w-3/4 p-1`}
        >
          <div className="p-3 border-b mb-1 flex items-center gap-4 text-center w-full">
            <img
              src={`/arrow-left-solid.svg`}
              alt="login ilustration"
              className=" w-5 sm:hidden flex"
              onClick={handleBackClick}
            />
            <h1 className="text-2xl font-semibold text-white">{headerText}</h1>
          </div>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
          <TabsContent value="delete">Delete account</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;
