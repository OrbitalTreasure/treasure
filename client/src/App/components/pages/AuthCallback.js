import { useContext, useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import axios from "axios";
import { Redirect, useHistory } from "react-router";

const AuthCallback = (props) => {
  const url = new URLSearchParams(window.location.search);
  const { setTokens } = useContext(TokenContext);
  const code = url.get("code");
  const state = url.get("state");
  const history = useHistory();

  const getAccessToken = (code) => {
    axios
      .get(`/api/v1/generateAccessToken?code=${code}`)
      .then((res) => {
        const data = res.data;
        setTokens(data);
        window.localStorage.setItem("tokens", JSON.stringify(data));
        history.push(state);
      })
      .catch(console.log);
  };

  useEffect(() => getAccessToken(code), []);

  return (
    <div>
      <h1>Please wait while you are getting redirected</h1>
    </div>
  );
};

export default AuthCallback;
