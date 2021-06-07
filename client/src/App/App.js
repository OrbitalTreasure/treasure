import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadDb from "./pages/LoadDb/LoadDb";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/tools/loadDb" component={LoadDb}></Route>
      </Switch>
    </Router>
  );
}

export default App;
