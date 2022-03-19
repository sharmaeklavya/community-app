import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Account from "./components/Account";
import Protected from "./authenticate/PrivateRoute";

function App() {
  return (
    <Router>
      <Switch>
        <Protected path="/account" component={Account} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
