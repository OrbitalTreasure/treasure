import React from "react";
const snoowrap = require("snoowrap");

function Login(props) {
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

  return (
    <input
      type="button"
      value="Login in Using Reddit"
      onClick={redirectToLogin}
    ></input>
  );
}

export default Login;
