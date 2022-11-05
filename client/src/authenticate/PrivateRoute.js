import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import LoadAnime from "../components/LoadAnim";
import { Types } from "../redux/constants/types";
import { UserAuth } from "./UserAuth";

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
        <LoadAnime />
      </div>
    );

  if (isLoggedIn === 0) return <Redirect to="/" />;

  if (isLoggedIn === 1)
    return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default Protected;
