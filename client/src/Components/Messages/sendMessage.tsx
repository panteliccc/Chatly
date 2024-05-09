import React, { useState } from "react";
import { Input } from "../ui/input";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useChatState } from "../../Context/Provider";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FaceIcon, ImageIcon } from "@radix-ui/react-icons";
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
  };

  return (
    <div className="flex flex-col-reverse md:flex-col gap-2">
      {showPicker && (
        <Picker
          data={data}
          onEmojiSelect={(e: any) => {
            onEmojiClick(e);
          }}
          previewPosition="none"
          dynamicWidth="true"
          maxFrequentRows={1}
        />
      )}
      <div className="p-1  flex gap-3 relative">
        <div className=" rounded-full bg-secondary w-full flex px-3 items-center">
          <div className="flex items-center gap-3">
            <FaceIcon
              className=" w-6 h-6 cursor-pointer "
              onClick={() => setShowPicker((val) => !val)}
            />
            <label htmlFor="sendImage">
              <ImageIcon className=" w-6 h-6 cursor-pointer " />
            </label>
          </div>
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
        </div>
        <button
          className="w-16 bg-softBlue md:flex items-center justify-center rounded-full hidden"
          onClick={sendMessage}
        >
          <img src="/send.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
