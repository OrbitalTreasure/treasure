import "./App.css";
import { useState, useEffect } from "react";
import Dashboard from "./components/pages/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadDb from "./components/pages/LoadDb";
import User from "./components/pages/User";
import Post from "./components/pages/Post";
import NotFound from "./components/pages/NotFound";
import Login from "./components/pages/Login";
import AuthCallback from "./components/pages/AuthCallback";
import Profile from "./components/pages/Profile";
import MetamaskLogin from "./components/pages/MetamaskLogin";
import LoginRoute from "./components/routes/LoginRoute";
import MetamaskRoute from "./components/routes/MetamaskRoute";
import { TokenContext } from "./contexts/TokenContext";
import Offer from "./components/pages/Offer";

function App() {
  const [tokens, setTokens] = useState({});
  const [metamaskAccount, setMetamaskAccount] = useState("");

  const getLoginFromLocalStorage = () => {
    const localToken = window.localStorage.getItem("tokens");
    if (localToken != undefined) {
      setTokens(JSON.parse(localToken));
    }
  };

  const getMetamaskFromLocalStorage = () => {
    const localMetamask = window.localStorage.getItem("metamask");
    if (localMetamask != undefined) {
      setMetamaskAccount(localMetamask);
    }
  };

  useEffect(() => {
    getLoginFromLocalStorage();
    getMetamaskFromLocalStorage();
  }, []);

  return (
    <Router>
      <TokenContext.Provider
        value={{ tokens, setTokens, metamaskAccount, setMetamaskAccount }}
      >
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <LoginRoute exact path="/profile" component={Profile} />
          <MetamaskRoute exact path="/offer/:postId" component={Offer} />
          <Route exact path="/metamask" component={MetamaskLogin} />
          <Route exact path="/auth-callback" component={AuthCallback} />
          <Route exact path="/tools/loadDb" component={LoadDb} />
          <Route path="/user/:userId" component={User} />
          <Route path="/post/:postId" component={Post} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </TokenContext.Provider>
    </Router>
  );
}

export default App;
