import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import decode from "jwt-decode";
import { UserAuth } from "../authenticate/UserAuth";
import baseApi from "../apis/baseApi";

function Header() {
  const history = useHistory();
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) {
        const accountInfo = decode(response.refreshToken);
        setUser({
          id: accountInfo._id,
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName,
          email: accountInfo.email,
        });
      }
    })();
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await baseApi.post("/api/auth/logout", { id: user.id });
      if (response.data) {
        setUser({ id: "", firstName: "", lastName: "", email: "" });
        history.push("/");
        window.location.reload();
      }
    } catch (err) {
      console.error(err.response.data);
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
                {Object.keys(user.firstName).length > 0 ? (
                  <ul className="menu">
                    <li className="menu-item">
                      <button className="cta-btn navi-btn shadow-lg">
                        {(
                          user.firstName.charAt(0).toUpperCase() +
                          user.firstName.slice(1)
                        ).slice(0, 8)}
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
