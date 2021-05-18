import {Redirect} from 'react-router-dom'
const snoowrap = require("snoowrap");

function CallbackLogic(props) {
  const url = new URLSearchParams(window.location.search);
  //   const state = url.get("state");
  const code = url.get("code");

  function getAccessToken() {
    snoowrap
      .fromAuthCode({
        code: code,
        userAgent: "TreasureOrbital-v1.0",
        clientId: "DzfZOF3d3768Yw",
        clientSecret: "sBfggKGPAq5b7IbZoYXrKmKHqoEdoA",
        redirectUri: "http://localhost:3000/auth-callback",
      })
      .then((e) => {
        props.setInstance(e);
      })
      .catch((r) => console.log(r));
  }
  getAccessToken();

  return <Redirect to="/"/> ;
}

export default CallbackLogic;
