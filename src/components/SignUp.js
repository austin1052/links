import React, { useState } from "react";
import { registerUser, setToken } from "../utils";

const SignUp = ({ setUser, setShowSignUp }) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [verifyPasswordInput, setVerifyPasswordInput] = useState("");

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

  const verifyPasswordChangeHandler = (event) => {
    event.preventDefault();
    setVerifyPasswordInput(event.target.value);
  };

  const handleClick = () => {
    setShowSignUp(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (passwordInput !== verifyPasswordInput) {
      alert("Passwords do not match!");
      setPasswordInput("");
      setVerifyPasswordInput("");
      return;
    }
    try {
      const user = await registerUser(usernameInput, passwordInput);
      if (!user.token) {
        alert(user.data);
        setPasswordInput("");
        setVerifyPasswordInput("");

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
          <label for="verify__password">Verify password</label>
          <input
            type="password"
            className="verify__password"
            placeholder="password"
            value={verifyPasswordInput}
            onChange={verifyPasswordChangeHandler}
            required
          />
          <button className="auth__button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
      <div id="toggle__link">
        Already have an account?
        <span onClick={handleClick}> Log in here.</span>
      </div>
    </>
  );
};

export default SignUp;
