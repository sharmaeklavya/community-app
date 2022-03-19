import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Types } from "../redux/constants/types";
import baseApi from "../apis/baseApi";
import Header from "./Header";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
      values.password
    )
  ) {
    errors.password = "Must include one number and a special character";
  }

  return errors;
};

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      responseError: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const res = await baseApi.post("api/auth/login", values);
        if (res.data.refreshToken) {
          dispatch({ type: Types.VALID_USER, payload: res.data });
          history.push("/account");
        }
      } catch (err) {
        formik.errors.responseError = err.response.data;
        console.error(err.response);
      }
    },
  });
  return (
    <React.Fragment>
      <Header />
      <div className="container">
        <div className="row entry-page">
          <div className="col-md-5">
            <aside className="user-form-aside">
              <h4 className="sub-heading">Welcome back!</h4>
              <small className="small-text">
                Start sharing your thoughts, beliefs, revisit your activities,
                drop a comment.
              </small>
            </aside>
          </div>
          <div className="col-md-7 border-left">
            <form className="user-form mt-5" onSubmit={formik.handleSubmit}>
              <h3 className="sub-heading font-weight-bold">
                Login to Community Blog
              </h3>
              {formik.errors.responseError ? (
                <small className="text-danger text-center">
                  {formik.errors.responseError}
                </small>
              ) : null}
              <hr />

              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="inputEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    name="email"
                    placeholder="Valid email only"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email ? (
                    <small className="text-danger">{formik.errors.email}</small>
                  ) : null}
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="inputPassword">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    name="password"
                    placeholder="6+ characters"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password ? (
                    <small className="text-danger">
                      {formik.errors.password}
                    </small>
                  ) : null}
                </div>
              </div>
              <div className="text-center">
                <button type="submit" className="cta-btn entry-btn">
                  Login now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
