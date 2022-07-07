import React, { useState } from "react";
import { LogIn, SignUp } from "./index";
import "../css/Auth.css";

const Auth = ({ setUser }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="auth__page">
      <h1>One website to link them all</h1>
      <div className="body">
        {showSignUp ? (
          <SignUp setUser={setUser} setShowSignUp={setShowSignUp} />
        ) : (
          <LogIn setUser={setUser} setShowSignUp={setShowSignUp} />
        )}
      </div>
    </div>
  );
};

export default Auth;
