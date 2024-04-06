import React from "react";

function DeleteAccount(props: any) {
  return (
    <div className="px-5">
      <div className="py-3  border-b mb-1 flex items-center gap-4 text-center w-full">
        <img
          src={`/arrow-left-solid.svg`}
          alt="login ilustration"
          className=" w-5 md:hidden flex"
          onClick={props.handleBackClick}
        />
        <h1 className="text-2xl font-semibold text-white">Delete Account</h1>
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
        <button className=" w-52 p-5 bg-destructive rounded mt-7">Delete Account</button>
      </div>
    </div>
  );
}

export default DeleteAccount;
