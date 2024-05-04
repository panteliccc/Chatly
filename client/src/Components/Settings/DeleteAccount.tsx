import { useChatState } from "../../Context/Provider";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function DeleteAccount(props: any) {
  const chatState = useChatState();
  const router = useNavigate();
  const deleteAccount = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/deleteAccount`,
        {},
        {
          withCredentials: true,
        }
      );
      chatState.removeCookie(["chatly.session-token"]);
      router("/Account/Login");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="px-5">
       <div className="py-2  border-b mb-1 flex items-center gap-4 text-center w-full">
          <img
            src={`/arrow-left-solid.svg`}
            alt="login ilustration"
            className=" w-5 md:hidden flex"
            onClick={props.handleBackClick}
          />
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            Delete Account
          </h1>
        </div>
      <div className="flex flex-col gap-3 py-6">
        <p className="text-lg md:text-xl">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>

        <p className="text-lg md:text-xl">
          Please note that deleting your account will permanently remove all
          your data from our system.
        </p>

        <p className="text-lg md:text-xl">
          If you're certain about this decision, click the "Delete Account"
          button below.
        </p>
        <button
          className=" w-52 p-5 bg-destructive rounded mt-7"
          onClick={deleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default DeleteAccount;
