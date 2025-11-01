import React from "react";
import "./Sidebar.scss";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = ["Home", "Add Item",  "Logout"];

  return (
    <div className="sidebar">
      <h2 className="logo">Find It Hub</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={activeMenu === item ? "active" : ""}
            onClick={() => setActiveMenu(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
