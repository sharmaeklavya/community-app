import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import decode from "jwt-decode";
import baseApi from "../apis/baseApi";

function Header() {
  const history = useHistory();
  const validUser = useSelector((state) => state.validUser.user);
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    console.log(validUser);
    if (validUser) {
      const accountInfo = decode(validUser.refreshToken);
      setUser({
        id: accountInfo._id,
        firstName: accountInfo.firstName,
        lastName: accountInfo.lastName,
        email: accountInfo.email,
      });
    }
  }, [validUser]);

  const handleLogout = async () => {
    try {
      const res = await baseApi.post("api/auth/logout", { id: user.id });
      if (res.data) {
        history.push("/");
        window.location.reload();
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12">
            <nav className="navi">
              <Link to="/" className="logo">
                <h4 className="sub-heading text-light mt-2 mb-0">
                  Community Blog
                </h4>
                <small className="small text-light">
                  An ultimate place for answers
                </small>
              </Link>
              <div className="cta">
                <input className="menu-btn" type="checkbox" id="menu-btn" />
                <label className="menu-icon" htmlFor="menu-btn">
                  <span className="navicon"></span>
                </label>
                {validUser ? (
                  <ul className="menu">
                    <li className="menu-item">
                      <button className="cta-btn navi-btn shadow-lg">
                        {user.firstName.charAt(0).toUpperCase() +
                          user.firstName.slice(1)}
                      </button>
                    </li>
                    <li className="menu-item">
                      <Link
                        to="/"
                        onClick={handleLogout}
                        className="cta-btn navi-btn shadow-lg"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <ul className="menu">
                    <li className="menu-item">
                      <Link
                        to="/register"
                        className="cta-btn navi-btn shadow-lg"
                      >
                        Register
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link to="/login" className="cta-btn navi-btn shadow-lg">
                        Login
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
