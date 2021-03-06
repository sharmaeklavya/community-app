import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserAuth } from "./UserAuth";
import { Types } from "../redux/constants/types";
import LoadAnim from "../components/LoadAnim";

function Protected({ component: Component, ...rest }) {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(-1);

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) {
        dispatch({ type: Types.VALID_USER, payload: response.data });
        setIsLoggedIn(1);
      } else setIsLoggedIn(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoggedIn === -1)
    return (
      <div className="container">
        <LoadAnim />
      </div>
    );

  if (isLoggedIn === 0) return <Redirect to="/" />;

  if (isLoggedIn === 1)
    return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default Protected;
