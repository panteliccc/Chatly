import React, { useEffect, useRef, useState } from "react";
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emoji: any) => {
    setMessage((prevInput) => prevInput + emoji.native);
  };
  useAutosizeTextArea(textAreaRef.current, message);
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
      <div className="p-1  flex gap-2 relative items-end">
        <div className="rounded-3xl  bg-secondary w-full flex px-3 items-end">
          <div className="flex items-center md:gap-3">
            <div className="w-12 h-12 flex justify-center items-center">
              <FaceIcon
                className=" w-6 h-6 cursor-pointer "
                onClick={() => setShowPicker((val) => !val)}
              />
            </div>
            <label htmlFor="sendImage" className=" hidden md:flex ">
              <ImageIcon className=" w-6 h-6 cursor-pointer" />
            </label>
          </div>
          <textarea
            rows={1}
            ref={textAreaRef}
            placeholder="Message..."
            className="py-3 px-3 x`border-0 w-full outline-none bg-transparent resize-none max-h-[160px] ScrollBar"
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
          <label
            htmlFor="sendImage"
            className=" md:hidden w-12 h-12 flex justify-center items-center"
          >
            <ImageIcon className=" w-6 h-6 cursor-pointer" />
          </label>
        </div>
        <button
          className="w-12 h-12 bg-softBlue flex items-center justify-center rounded-full"
          onClick={sendMessage}
        >
          <img src="/send.svg" alt="" className="w-1/2 h-1/2" />
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
