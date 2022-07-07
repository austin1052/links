import React, { useState } from "react";
import { logInUser, setToken } from "../utils";

const LogIn = ({ setUser, setShowSignUp }) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
  };

  const usernameChangeHandler = (event) => {
    event.preventDefault();
    setUsernameInput(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    event.preventDefault();
    setPasswordInput(event.target.value);
  };

  const handleClick = () => {
    setShowSignUp(true);
  };

  const handleLogIn = async (event) => {
    event.preventDefault();
    try {
      const user = await logInUser(usernameInput, passwordInput);
      // check for error
      if (!user.token) {
        alert(user.message);
        setPasswordInput("");
        return;
      }
      setToken(user.token);
      setUser(user.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="auth__form">
        <form onSubmit={submitHandler}>
          <label for="username">Username</label>
          <input
            type="text"
            className="username"
            placeholder="username"
            value={usernameInput}
            onChange={usernameChangeHandler}
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            className="password"
            placeholder="password"
            value={passwordInput}
            onChange={passwordChangeHandler}
            required
          />
          <button className="auth__button" onClick={handleLogIn}>
            Log In
          </button>
        </form>
      </div>
      <div id="toggle__link">
        <span onClick={handleClick}>Sign up</span> for an account
      </div>
    </>
  );
};

export default LogIn;
