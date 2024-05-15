import { useChatState } from "../../Context/Provider";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ImageView() {
  const chatState = useChatState();
  return (
    <div
      className={`${
        chatState.visibleImage ? "flex" : "hidden"
      } absolute top-0 left-0 w-full h-full bg-[#000000e8] items-center justify-center z-50 `}
    >
      <FontAwesomeIcon
        icon={faXmark}
        className="text-2xl p-3 cursor-pointer rounded-r absolute top-4 right-4 text-white"
        onClick={() => chatState.setVisibleImage(false)}
      />
      <div className="w-10/12 h-full flex items-center justify-center">
        {chatState.imageView && (
          <img src={chatState.imageView} alt="image" className="max-w-full max-h-full" />
        )}
      </div>
    </div>
  );
}

export default ImageView;
