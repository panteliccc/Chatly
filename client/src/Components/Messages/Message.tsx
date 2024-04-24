import React from "react";

interface Props {
  sender: boolean;
  text: string;
  showIcon: boolean; 
}

function Message(props: Props) {
  return (
    <div className={`flex ${props.sender ? "justify-end" : "justify-start"} relative`}>
      {props.showIcon && ( 
        <span className={`${props.sender ? "-right-[6px]" : "-left-[6px]"} absolute top-0`}>
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="4 6 7 4.5"
            width="16"
            height="10.29"
          >
            <path
              d="M4 6H11L7.5 10.5L4 6Z"
              fill={`${props.sender ? "hsl(223, 96%, 54%)" : "hsl( 210, 15%, 26%)"}`}
            ></path>
          </svg>
        </span>
      )}
      <div
        className={`${
          props.sender ? "bg-softBlue " : " bg-primary "
        } py-1 px-3 relative break-words max-w-[90%] xl:max-w-[70%] rounded-xl`}
      >
        {props.text}
      </div>
    </div>
  );
}

export default Message;
