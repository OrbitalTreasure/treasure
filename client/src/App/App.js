import "./App.css";
import Dashboard from "./components/pages/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadDb from "./components/pages/LoadDb";
import User from "./components/pages/User";
import Post from "./components/pages/Post";
import NotFound from "./components/pages/NotFound";
import Login from "./components/pages/Login"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/tools/loadDb" component={LoadDb} />
        <Route path="/user/:userId" component={User} />
        <Route path="/post/:postId" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
