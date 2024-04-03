import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/ui/tabs";

function Settings() {

  return (
    <div className="bg-background h-screen w-screen">
      <Tabs
        defaultValue="account"
        className="w-screen flex items-start h-screen"
      >
        <TabsList className="flex-col h-full justify-between w-1/6 bg-secondary">
          <div>
            <TabsTrigger value="account" className="w-full py-5 text-lg">
              Edit Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="w-full py-5 text-lg">
              Change Password
            </TabsTrigger>
            <TabsTrigger value="delete" className="w-full py-5 text-lg">
              Delete Account
            </TabsTrigger>
          </div>
          <button className="w-full py-5 text-xl bg-background rounded text-destructive font-bold ">
            Log Out
          </button>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
