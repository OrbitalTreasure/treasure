import React, { useContext } from "react";
import { TokenContext } from "../contexts/TokenContext";
const snoowrap = require("snoowrap");

function Login(props) {
  const { isLoggedIn, username, logout} = useContext(TokenContext);

  function redirectToLogin(e) {
    const url = snoowrap.getAuthUrl({
      clientId: "DzfZOF3d3768Yw",
      scope: ["identity"],
      redirectUri: "http://localhost:3000/auth-callback",
      permanant: true,
      state: "123",
    });
    window.open(url);
  }

  const loggedIn = (
    <div>
      <input type="button" value="Logout" onClick={logout}></input>
      <h1>hello, {username}</h1>
    </div>
  );

  const loggedOut = (
    <input
      type="button"
      value="Login in Using Reddit"
      onClick={redirectToLogin}
    ></input>
  );

  return isLoggedIn() ? loggedIn : loggedOut;
}

export default Login;
