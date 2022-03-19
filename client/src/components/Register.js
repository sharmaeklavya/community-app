import React from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import Header from "./Header";
import baseApi from "../apis/baseApi";

function calculate_age(dob) {
  const diff_year = new Date().getFullYear() - new Date(dob).getFullYear();
  return diff_year;
}

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length < 3) {
    errors.firstName = "Must be 3 characters or more";
  }

  if (!values.lastName) {
    errors.lastName = "Required";
  } else if (values.lastName.length < 2) {
    errors.lastName = "Must be 2 characters or more";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Required";
  } else if (calculate_age(values.dateOfBirth) < 12) {
    errors.dateOfBirth = "Must be 12 years or more";
  }

  if (!values.gender) {
    errors.gender = "Required";
  } else if (values.gender.length < 2) {
    errors.gender = "Select one from the dropdown";
  }

  if (!values.city) {
    errors.city = "Required";
  } else if (values.city.length < 5) {
    errors.city = "Must be 5 characters or more";
  }

  if (!values.state) {
    errors.state = "Required";
  } else if (values.state.length > 5) {
    errors.state = "Select one from the dropdown";
  }

  if (!values.pinCode) {
    errors.pinCode = "Required";
  } else if (!/^[1-9][0-9]{5}$/.test(values.pinCode)) {
    errors.pinCode = "Must not start with 0 and be 6 digits long";
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = "Required";
  } else if (!/^(9|8|7|6)\d{9}$/.test(values.phoneNumber)) {
    errors.phoneNumber = "Must start with 9, 8 or 7 and be 10 digits long";
  }

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

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

function Register() {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      city: "",
      state: "",
      pinCode: 0,
      phoneNumber: 0,
      email: "",
      password: "",
      confirmPassword: "",
      responseError: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const res = await baseApi.post("api/auth/register", values);
        if (res.data) {
          alert("Registered Successfully");
          history.push("/login");
        }
      } catch (err) {
        formik.errors.responseError = err.response.data;
        console.error(err.response.data);
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
              <h4 className="sub-heading">Why register?</h4>
              <small className="small-text">
                Share your thoughts, beliefs, record your activities, drop a
                comment.
              </small>
            </aside>
          </div>
          <div className="col-md-7 border-left">
            <form
              className="user-form mt-5"
              onSubmit={formik.handleSubmit}
              style={{ height: "70vh", overflowY: "auto" }}
            >
              <h3 className="sub-heading font-weight-bold">
                Register to Community Blog
              </h3>
              {formik.errors.responseError ? (
                <small className="text-danger text-center">
                  {formik.errors.responseError}
                </small>
              ) : null}
              <hr />
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputFirstName">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputFirstName"
                    name="firstName"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.firstName ? (
                    <small className="text-danger">
                      {formik.errors.firstName}
                    </small>
                  ) : null}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputLastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputLastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.lastName ? (
                    <small className="text-danger">
                      {formik.errors.lastName}
                    </small>
                  ) : null}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputDob">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="inputDob"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.dateOfBirth ? (
                    <small className="text-danger">
                      {formik.errors.dateOfBirth}
                    </small>
                  ) : null}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputGender">Gender</label>
                  <select
                    name="gender"
                    className="form-control"
                    id="inputGender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="she">She</option>
                    <option value="he">He</option>
                    <option value="they">They</option>
                  </select>
                  {formik.errors.gender ? (
                    <small className="text-danger">
                      {formik.errors.gender}
                    </small>
                  ) : null}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputCity">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.city ? (
                    <small className="text-danger">{formik.errors.city}</small>
                  ) : null}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPin">Pin</label>
                  <input
                    type="number"
                    className="form-control"
                    id="inputPin"
                    name="pinCode"
                    placeholder="6 digits only"
                    value={formik.values.pinCode}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.pinCode ? (
                    <small className="text-danger">
                      {formik.errors.pinCode}
                    </small>
                  ) : null}
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="inputState">State</label>
                  <select
                    id="inputState"
                    className="form-control"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Andaman and Nicobar Islands">
                      Andaman and Nicobar Islands
                    </option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Dadar and Nagar Haveli">
                      Dadar and Nagar Haveli
                    </option>
                    <option value="Daman and Diu">Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>{" "}
                  </select>
                  {formik.errors.state ? (
                    <small className="text-danger">{formik.errors.state}</small>
                  ) : null}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputPhone">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    id="inputPhone"
                    name="phoneNumber"
                    placeholder="10 digits only"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phoneNumber ? (
                    <small className="text-danger">
                      {formik.errors.phoneNumber}
                    </small>
                  ) : null}
                </div>
                <div className="form-group col-md-6">
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
                <div className="form-group col-md-6">
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
                <div className="form-group col-md-6">
                  <label htmlFor="inputConfirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputConfirmPassword"
                    name="confirmPassword"
                    placeholder="6+ characters"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.confirmPassword ? (
                    <small className="text-danger">
                      {formik.errors.confirmPassword}
                    </small>
                  ) : null}
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="cta-btn entry-btn">
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Register;
