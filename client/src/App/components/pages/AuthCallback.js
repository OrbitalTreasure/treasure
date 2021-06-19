import { useContext, useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import axios from "axios";
import { Redirect } from "react-router";
const AuthCallback = () => {
  const url = new URLSearchParams(window.location.search);
  const { setTokens } = useContext(TokenContext);
  const code = url.get("code");

  const getAccessToken = (code) => {
    axios
      .get(`/generateAccessToken?${code}`)
      .then((data) => setTokens(data))
      .catch(console.log);
  };

  useEffect(() => getAccessToken(code), []);

  return <Redirect to="/" />;
};

export default AuthCallback;
