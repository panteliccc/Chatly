import React, { useState } from "react";
import { Input } from "../ui/input";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useChatState } from "../../Context/Provider";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faImage } from "@fortawesome/free-regular-svg-icons";

interface Message {
  user: User;
  text: string;
  createdAt: string;
  isImage: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted: boolean;
}

interface Props {
  socket: any;
}

function SendMessage(props: Props) {
  const chatState = useChatState();
  const [message, setMessage] = useState("");
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");

  const sendMessage = async () => {
    if (message.trim() === "") {
      return;
    }
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/sendMessage`,
        {
          text: message, 
          chat: chatId,
          isImage: false,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      props.socket.emit("new message", data);
      chatState.setMessages((prev: Message[]) => {
        return [...prev, data];
      });
      chatState.setRefreshChats(!chatState.refreshChats);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emoji: any) => {
    setMessage((prevInput) => prevInput + emoji.native);
    setShowPicker(false);
  };

  return (
    <div className="p-3 bg-primary flex gap-3 relative">
      <div className="rounded bg-secondary w-full flex px-2 items-center">
        {showPicker && (
          <div className="absolute bottom-24 left-0 w-full md:w-auto md:left-3">
            <Picker
              data={data}
              onEmojiSelect={(e: any) => {
                onEmojiClick(e);
              }}
            />
          </div>
        )}
        <FontAwesomeIcon
          icon={faFaceSmile}
          onClick={() => setShowPicker((val) => !val)}
          className="emoji-icon text-2xl cursor-pointer"
        />
        <Input
          placeholder="Message..."
          className="py-7 px-3 shadow-none focus-visible:ring-0 border-0 w-full break-words "
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            onKeyDown(e);
          }}
        />
        <Input
          type="file"
          className="hidden w-0"
          id="sendImage"
          name="sendImage"
          accept=".jpg,.png,.mp4"
          onChange={(e: any) => chatState.setImage(e.target.files[0])}
        />
        <label htmlFor="sendImage">
          <FontAwesomeIcon
            icon={faImage}
            className="emoji-icon text-2xl cursor-pointer"
          />
        </label>
      </div>
      <button
        className="w-16 bg-softBlue md:flex items-center justify-center rounded hidden"
        onClick={sendMessage}
      >
        <img src="/send.svg" alt="" />
      </button>
    </div>
  );
}

export default SendMessage;
