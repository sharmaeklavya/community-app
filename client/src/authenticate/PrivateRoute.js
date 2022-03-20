import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserAuth } from "./UserAuth";
import LoadSvg from "./LoadSvg";

function Protected({ component: Component, ...rest }) {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(-1);

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) {
        setIsLoggedIn(1);
      } else setIsLoggedIn(0);
    })();
  }, [dispatch]);

  if (isLoggedIn === -1)
    return (
      <div className="container">
        <LoadSvg />
      </div>
    );

  if (isLoggedIn === 0) return <Redirect to="/" />;

  if (isLoggedIn === 1)
    return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default Protected;
