import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { UserAuth } from "./authenticate/UserAuth";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Account from "./components/Account";
import Protected from "./authenticate/PrivateRoute";

function App() {
  const [userLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    UserAuth.getToken()
      .then((res) => {
        if (res) setLoggedIn(true);
      })
      .catch((err) => setLoggedIn(false));
  }, []);

  return (
    <Router>
      <Switch>
        <Protected path="/account" component={Account} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/login" exact>
          {userLoggedIn ? <Redirect to="/account" /> : <Login />}
        </Route>
        <Route path="/">
          {userLoggedIn ? <Redirect to="/account" /> : <Home />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
