import { useContext, useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import axios from "axios";
import { Redirect, useHistory } from "react-router";

const AuthCallback = (props) => {
  const url = new URLSearchParams(window.location.search);
  const { setTokens } = useContext(TokenContext);
  const code = url.get("code");
  const error = url.get("error");
  const state = url.get("state");
  const history = useHistory();

  const getAccessToken = (code, state) => {
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

  const handleAuthToken = (authCode, error, state) => {
    if (error) {
      return history.push(
        `/login?error=${error}`
        );
    }
    getAccessToken(authCode, state);
  };

  useEffect(() => handleAuthToken(code, error, state), []);

  return (
    <div>
      <h1>Please wait while you are getting redirected</h1>
    </div>
  );
};

export default AuthCallback;
