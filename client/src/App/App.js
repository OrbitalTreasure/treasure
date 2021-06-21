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
import { TokenContext } from "./contexts/TokenContext";

function App() {
  const [tokens, setTokens] = useState({});

  useEffect(() => {
    const localToken = window.localStorage.getItem("tokens");
    if (localToken != undefined) {
      setTokens(JSON.parse(localToken));
    }
  }, []);

  return (
    <Router>
      <TokenContext.Provider value={{ tokens, setTokens }}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <LoginRoute exact path="/profile" component={Profile} />
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
