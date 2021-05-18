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

  function getUser() {
    console.log(props.instance);
    props.instance
      .getMe()
      .then(console.log)
      .catch((e) => console.log(e));
    return "hi";
  }

  const output = props.instance ? (
    <h1>{getUser()}</h1>
  ) : (
    <input
      type="button"
      value="Login in Using Reddit"
      onClick={redirectToLogin}
    ></input>
  );

  return <div>{output}</div>;
}

export default Login;
