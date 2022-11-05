import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import { controller, UserAuth } from "./authenticate/UserAuth";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
// import Protected from "./authenticate/PrivateRoute";

function App() {
  const [userLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) setLoggedIn(true);
      else setLoggedIn(false);
    })();
    return () => controller.abort();
  }, []);

  return (
    <Router>
      <Switch>
        {/* <Protected path="/" component={} exact /> */}
        <Route path="/register" component={Register} exact />
        <Route path="/login" exact>
          {userLoggedIn ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/" component={Home}></Route>
      </Switch>
    </Router>
  );
}

export default App;
