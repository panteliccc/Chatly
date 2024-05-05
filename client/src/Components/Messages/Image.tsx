import { useChatState } from "../../Context/Provider";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { chatImage } from "../../config/Config";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  visible: boolean;
  socket: any;
}
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

function SendImage(props: Props) {
  const chatState = useChatState();
  const [imageUrl, setImageUrl] = useState<string | null>(null);  
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chat");

  useEffect(() => {
    if (chatState.image) {
      const imageUrl = URL.createObjectURL(chatState.image);
      setImageUrl(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  }, [chatState.image]);

  const sendMessage = async () => {
    if (chatState.image) {
      const name = new Date().getTime() + (chatState.image?.name || "");
      const storageRef = ref(chatImage, "ChatImage/" + name);
      const uploadTask =
        chatState.image && uploadBytesResumable(storageRef, chatState.image);

      setUploading(true);
      setUploadProgress(0);

      uploadTask?.on(
        "state_changed",
        (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error: any) => {
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            postMessage(downloadURL);
          });
        }
      );
    }
  };

  const postMessage = async (link: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/sendMessage`,
        {
          text: link,
          chat: chatId,
          isImage: true,
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
      chatState.setImage(null);
      setUploading(false);
    } catch (err) {
      setUploading(false);
    }
  };

  return (
    <div
      className={`bg-[#000000e8] absolute w-full h-full p-2 md:p-4 xl:p-6 ${
        props.visible ? "flex" : "hidden"
      } justify-between flex-col items-center`}
    >
      <FontAwesomeIcon
        icon={faXmark}
        className="text-2xl p-3 cursor-pointer rounded-r absolute right-4 top-4 "
        onClick={() => chatState.setImage(null)}
      />
      <div className="w-10/12 h-full flex items-center justify-center">
        {imageUrl && <img src={imageUrl} alt="image" className="w-full" />}
      </div>
      <button
        className="w-16 h-16 bg-softBlue items-center justify-center rounded-full flex self-end"
        onClick={sendMessage}
      >
        <img src="/send.svg" alt="" />
      </button>
      {uploading && (
        <div className="text-white absolute bottom-4">{Math.round(uploadProgress)}% - Uploading...</div>
      )}
    </div>
  );
}

export default SendImage;
