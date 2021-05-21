import "../styles/App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useState } from "react";
import Homepage from "./Homepage";
import CallbackLogic from "./CallbackLogic";
import { TokenContext } from "../contexts/TokenContext";

function App() {
  const [tokens, setTokens] = useState({});
  const [username, setUsername] = useState("");
  const isLoggedIn = () => "accessToken" in tokens && "refreshToken" in tokens;
  const logout = () => {
    setTokens({});
    setUsername({});
    window.location.reload();
  };
  return (
    <BrowserRouter>
      <Switch>
        <TokenContext.Provider
          value={{ tokens, setTokens, isLoggedIn, username, setUsername , logout}}
        >
          <Route path="/" component={Homepage} />
          <Route path="/auth-callback" component={CallbackLogic} />
        </TokenContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
