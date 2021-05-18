import { useEffect, useContext } from "react";
import { Redirect } from "react-router";
import snoowrap from "snoowrap";
import { TokenContext } from "../contexts/TokenContext";

function CallbackLogic(props) {
  const { setTokens } = useContext(TokenContext);

  const url = new URLSearchParams(window.location.search);
  //   const state = url.get("state");
  const code = url.get("code");

  function getAccessToken() {
    snoowrap
      .fromAuthCode({
        code: code,
        userAgent: "TreasureOrbital v1.0",
        clientId: "DzfZOF3d3768Yw",
        clientSecret: "sBfggKGPAq5b7IbZoYXrKmKHqoEdoA",
        redirectUri: "http://localhost:3000/auth-callback",
      })
      .then((e) => {
        setTokens({ accessToken: e.accessToken, refreshToken: e.refreshToken });
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => getAccessToken());

  return <Redirect to="/" />;
}

export default CallbackLogic;
