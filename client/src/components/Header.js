import { useFormik } from "formik";
import decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import baseApi from "../apis/baseApi";
import { UserAuth } from "../authenticate/UserAuth";
import { Types } from "../redux/constants/types";

const validate = (values) => {
  const errors = {};
  if (!values.postTitle) {
    errors.postTitle = "Required";
  } else if (values.postTitle.length < 5) {
    errors.postTitle = "Must be 5 characters or more";
  }
  if (!values.postDesc) {
    errors.postDesc = "Required";
  } else if (values.postDesc.length < 500) {
    errors.postDesc = "Must be 500 characters or more";
  }
  return errors;
};

function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.validUser.user);
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) {
        dispatch({ type: Types.VALID_USER, payload: response });
        const accountInfo = decode(response.refreshToken);
        setUserInfo({
          id: accountInfo._id,
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName,
          email: accountInfo.email,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      const response = await baseApi.post("/api/auth/logout", {
        id: userInfo.id,
      });
      if (response.data) {
        setUserInfo({ id: "", firstName: "", lastName: "", email: "" });
        history.push("/");
        window.location.reload();
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const formik = useFormik({
    initialValues: {
      postTitle: "",
      postDesc: "",
      responseError: "",
    },
    validate,
    onSubmit: async (values) => {
      if (!user)
        return (formik.errors.responseError =
          "Unauthorized! Please ensure you're logged in.");
      try {
        const response = await baseApi.post("/api/posts/createpost", values, {
          headers: { authorization: `Bearer ${user.refreshToken}` },
        });
        if (response) {
          setTimeout(() => window.location.reload(), 1000);
          // formik.errors.responseError = response.data;
        }
      } catch (err) {
        if (typeof err.response.data === "object") {
          Object.keys(err.response.data).some((k) => {
            formik.errors.responseError = err.response.data[k];
            return formik.errors.responseError;
          });
        } else formik.errors.responseError = err.response.data;
      }
    },
  });

  return (
    <React.Fragment>
      <header className="header">
        <div className="container">
          <div className="row">
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
                  {Object.keys(userInfo.firstName).length > 0 ? (
                    <ul className="menu">
                      <li className="menu-item heading">
                        <button
                          type="button"
                          className="cta-btn entry-btn shadow-lg"
                          data-toggle="modal"
                          data-target="#postModal"
                        >
                          Create a post
                        </button>
                      </li>
                      <li className="menu-item">
                        <button className="cta-btn navi-btn shadow-lg">
                          {(
                            userInfo.firstName.charAt(0).toUpperCase() +
                            userInfo.firstName.slice(1)
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
                        <Link
                          to="/login"
                          className="cta-btn navi-btn shadow-lg"
                        >
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
      {/* Model starts here */}
      <div
        className="modal fade"
        id="postModal"
        aria-labelledby="postModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="sub-heading" id="postModalLabel">
                New Post
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-group text-center m-0 p-0">
                  {formik.errors.responseError ? (
                    <small className="text-danger">
                      {formik.errors.responseError}
                    </small>
                  ) : null}
                </div>
                <div className="form-group">
                  <label
                    htmlFor="post-title"
                    className="col-form-label small-text"
                  >
                    Post Title
                  </label>
                  <input
                    type="text"
                    className="form-control body-text"
                    id="post-title"
                    name="postTitle"
                    value={formik.values.postTitle}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.postTitle ? (
                    <small className="text-danger">
                      {formik.errors.postTitle}
                    </small>
                  ) : null}
                </div>
                <div className="form-group">
                  <label
                    htmlFor="post-desc"
                    className="col-form-label small-text"
                  >
                    Post Description
                  </label>
                  <textarea
                    className="form-control body-text"
                    id="post-desc"
                    name="postDesc"
                    rows={5}
                    cols={33}
                    value={formik.values.postDesc}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.postDesc ? (
                    <small className="text-danger">
                      {formik.errors.postDesc}
                    </small>
                  ) : null}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="cta-btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cta-btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Model ends here */}
    </React.Fragment>
  );
}

export default Header;
