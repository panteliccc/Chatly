import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useChatState } from "../../Context/Provider";
function ChatInfoHeader() {
  const chatState = useChatState()
  return (
    
    <div className="p-3 flex gap-5 items-center bg-primary border-b w-full ">
      <FontAwesomeIcon icon={faClose} className="text-xl cursor-pointer" onClick={()=>{chatState.setOpenInfo(false)}}/>
      <h1 className="text-xl font-semibold">Chat info</h1>
    </div>
  );
}

export default ChatInfoHeader;
