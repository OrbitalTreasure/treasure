import "./App.css";
import {useState} from 'react';
import Homepage from "./Homepage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CallbackLogic from "./CallbackLogic"

function App() {
  const [redditInstance, setRedditInstance] = useState(null);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth-callback">
          <CallbackLogic setInstance={setRedditInstance}/>
        </Route>
        <Route path="/">
          <Homepage instance={redditInstance}/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
