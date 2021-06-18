import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadDb from "./pages/LoadDb/LoadDb";
import User from "./pages/User/User";
import Post from "./pages/Post/Post"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/user/:userId" component={User} />
        <Route path="/post/:postId" component={Post}/>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/tools/loadDb" component={LoadDb} />
      </Switch>
    </Router>
  );
}

export default App;
