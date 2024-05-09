import { useChatState } from "../../Context/Provider";
import React from "react";
import InfoCard from "./InfoCard";

function GroupPeople() {
  const chatState = useChatState();
  return (
    <div className="border-t p-2">
      <h1 className="text-xl">Group People</h1>
      {chatState.selectedChat?.isGroup && chatState.selectedChat.users ? (
        chatState.selectedChat.users.map((user) => <InfoCard user={user} key={user._id}/>)
      ) : (
        <></>
      )}
      <button className="mt-5 text-2xl text-[#fc0330]">Leave Group</button>
    </div>
  );
}

export default GroupPeople;
