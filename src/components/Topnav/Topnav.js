import React from "react";

const TopNav = () => {
const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const name = user.fullName || "User"
  console.log("name",name)
  return (
    <div className="topnav">
      <div className="user">
        <span>Welcome, {name}</span>
      </div>
    </div>
  );
};

export default TopNav;
