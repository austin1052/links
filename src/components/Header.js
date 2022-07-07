import React from "react";
import { handleLogOut } from "../utils";
import "../css/Header.css";


const Header = ({ user, setUser }) => {
  const handleClick = () => {
    handleLogOut();
  };

  return (
    <>
      <div id="header__container">
        <h1 id="main__header">Gotta click em all</h1>
      </div>
      {user && (
        <>
          <button
            className="button__large"
            id="log__out__button"
            onClick={handleClick}
          >
            Log Out
          </button>
        </>
      )}
    </>
  );
};

export default Header;
