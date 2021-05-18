import snoowrap from "snoowrap";

function CallbackLogic(props) {
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
        return;
      })
      .catch((e) => console.log(e));
  }
  getAccessToken();

  return <h1>hi</h1>;
}

export default CallbackLogic;
