import React from "react";
function Header() {
  return (
    <div>
      <div className={`flex p-3 justify-between items-center border-b `}>
        <div className="flex items-center gap-2">
          <h2 className={`text-2xl font-semibold`}>Chatly</h2>
        </div>
      </div>

    </div>
  );
}

export default Header;
