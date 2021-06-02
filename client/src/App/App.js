import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/tools/loadDb"></Route>
      </Switch>
    </Router>
  );
}

export default App;
