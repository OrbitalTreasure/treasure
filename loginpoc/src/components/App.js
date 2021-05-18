import "../styles/App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useState } from "react";
import Homepage from "./Homepage";
import CallbackLogic from "./CallbackLogic";
import { TokenContext } from "../contexts/TokenContext";

function App() {
  const [tokens, setTokens] = useState({});
  return (
    <BrowserRouter>
      <Switch>
        <TokenContext.Provider value={{ tokens, setTokens }}>
          <Route path="/auth-callback" component={CallbackLogic} />
          <Route path="/" component={Homepage} />
        </TokenContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
