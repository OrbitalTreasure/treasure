import "./App.css";
import Homepage from "./Homepage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CallbackLogic from "./CallbackLogic"

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth-callback">
          <CallbackLogic/>
        </Route>
        <Route path="/">
          <Homepage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
