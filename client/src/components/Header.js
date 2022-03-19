import React from "react";
import { Link, useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();

  const handleClick = () => {
    history.push("/");
    // window.location.reload();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-12">
            <nav className="navi">
              <div onClick={handleClick} className="logo">
                <h4 className="sub-heading text-light mt-2 mb-0">
                  Community Blog
                </h4>
                <small className="small text-light">
                  An ultimate place for answers
                </small>
              </div>
              <div className="cta">
                <input className="menu-btn" type="checkbox" id="menu-btn" />
                <label className="menu-icon" htmlFor="menu-btn">
                  <span className="navicon"></span>
                </label>
                <ul className="menu">
                  <li className="menu-item">
                    <Link to="/register" className="cta-btn navi-btn shadow-lg">
                      Register
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/login" className="cta-btn navi-btn shadow-lg">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
