import React, { useEffect, useState } from "react";
import ChatInfoHeader from "./ChatInfoHeader";
import { useChatState } from "../../Context/Provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import GroupPeople from "./GroupPeople";
import { ScrollArea } from "../ui/scrollarea";
import { Input } from "../ui/input";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { chatImage } from "../../config/Config";

interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
  isDeleted?: boolean;
}

function ChatInfo() {
  const chatState = useChatState();
  const [sender, setSender] = useState<User | null>(null);
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const users = chatState?.selectedChat?.users;
    const loggedUser = chatState.authUser;

    if (users && users.length > 0) {
      const isSenderDeleted = users.some(
        (user) => user._id !== loggedUser?._id && user.isDeleted
      );

      if (!isSenderDeleted) {
        const isSender = users[0]?._id === loggedUser?._id;
        const newSender = isSender ? users[1] : users[0];

        setSender(newSender);
        setName(
          chatState.selectedChat?.isGroup
            ? chatState.selectedChat.chatName
            : newSender?.username ?? ""
        );
      }
    }
  }, [
    chatState?.selectedChat?.users,
    chatState.authUser,
    chatState.selectedChat?.isGroup,
  ]);

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const addGroupImage = async () => {
    if (image) {
      const name = new Date().getTime() + (image?.name || "");
      const storageRef = ref(chatImage, "GroupImage/" + name);
      const uploadTask = image && uploadBytesResumable(storageRef, image);

      uploadTask?.on(
        "state_changed",
        (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            handleSubmit(downloadURL);
          });
        }
      );
    } else {
      // Ako korisnik nije odabrao novu sliku, samo izvršite handleSubmit sa null
      handleSubmit(null);
    }
  };

  const handleSubmit = async (groupImage: string | null) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/addGroupImage`,
        {
          _id: chatState.selectedChat?._id,
          groupImage: groupImage,
        },
        {
          withCredentials: true,
        }
      );
      setImageUrl(groupImage || "");
      setImage(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const cancelImageChange = () => {
    setImage(null);
    setImageUrl(chatState.selectedChat?.groupImage || "");
  };

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setImageUrl(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  }, [image]);

  return (
    <div
      className={`w-screen md:w-4/12 xl:w-3/12 border-0 md:border-l overflow-hidden ${
        chatState.openInfo ? "flex" : "hidden"
      } h-screen flex-col`}
    >
      <ScrollArea className="">
        <ChatInfoHeader />
        <div className="h-auto flex flex-col gap-5  py-5 items-center">
          <Avatar className="w-80 h-80 md:w-64 md:h-64 xl:w-80 xl:h-80 rounded-none">
            {chatState.selectedChat?.isGroup ? (
              <div className="w-full h-full relative">
                <div
                  className="cursor-pointer w-full h-full"
                  onClick={() =>
                    !image && document.getElementById("avatar")?.click()
                  }
                >
                  {image !== null ? (
                    <div className="w-full h-full flex flex-col gap-2 items-center rounded">
                      <AvatarImage
                        src={imageUrl}
                        className="w-9/12 h-9/12 rounded-full overflow-hidden"
                      />
                      <button
                        className="bg-border w-10/12 p-1 rounded"
                        onClick={addGroupImage}
                      >
                        Save
                      </button>
                      <button
                        className="text-background bg-foreground w-10/12 p-1 rounded"
                        onClick={cancelImageChange}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : chatState.selectedChat.groupImage ? (
                    <AvatarImage
                      src={imageUrl || chatState.selectedChat.groupImage}
                      className="w-full h-full rounded-full overflow-hidden"
                    />
                  ) : (
                    <AvatarFallback className="bg-[#272f37] text-7xl">
                      {chatState.selectedChat.chatName[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  onChange={(e: any) => setImage(e.target.files[0])}
                  accept=".png, .jpg, .jpeg"
                />
              </div>
            ) : sender?.image ? (
              <AvatarImage
                src={sender?.image}
                className="w-full h-full rounded-full overflow-hidden"
              />
            ) : (
              <AvatarFallback className="bg-[#272f37] text-7xl">
                {sender?.username[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <Input
            className="text-2xl border-0 ring-0 shadow-0 focus-visible:ring-0 active:ring-0 text-center bg-[#272f37] w-10/12 rounded p-6"
            onChange={handleNameChange}
            value={name}
            readOnly={
              chatState.selectedChat?.isGroup &&
              chatState.authUser?._id ===
                chatState.selectedChat?.groupAdmin?._id
                ? false
                : true
            }
          />
        </div>
        {chatState.selectedChat?.isGroup ? <GroupPeople /> : null}
      </ScrollArea>
    </div>
  );
}

export default ChatInfo;
