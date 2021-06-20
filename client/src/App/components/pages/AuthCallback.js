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
      .get(`/api/v1/generateAccessToken?code=${code}`)
      .then((res) => {
        const data = res.data;
        setTokens(data);
        window.localStorage.setItem("tokens", JSON.stringify(data));
      })
      .catch(console.log);
  };

  useEffect(() => getAccessToken(code), []);

  return <Redirect to="/" />;
};

export default AuthCallback;
