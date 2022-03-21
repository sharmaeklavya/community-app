import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { UserAuth } from "../authenticate/UserAuth";
import { Types } from "../redux/constants/types";
import baseApi from "../apis/baseApi";

const validate = (values) => {
  const errors = {};
  if (!values.commentDesc) {
    errors.commentDesc = "Required";
  } else if (values.commentDesc.length < 2) {
    errors.commentDesc = "Must be 2 characters or more";
  }
  if (!values.postId) {
    errors.postId = "Required";
  }
  return errors;
};

function Post(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const [selectedPost, setSelectedPost] = useState([]);
  const user = useSelector((state) => state.validUser.user);

  useEffect(() => {
    const post = props.posts.filter((post) => post._id === id);
    setSelectedPost(post);
  }, [props.posts, id]);

  useEffect(() => {
    (async () => {
      const response = await UserAuth.getToken();
      if (response) dispatch({ type: Types.VALID_USER, payload: response });
    })();
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      postId: "",
      commentDesc: "",
      responseError: "",
    },
    validate,
    onSubmit: async (values) => {
      if (!user) return (formik.errors.responseError = "Unauthorized Access!");
      try {
        const response = await baseApi.post("/api/posts/addcomment", values, {
          headers: { authorization: `Bearer ${user.refreshToken}` },
        });
        if (response) formik.errors.responseError = response.data;
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

  const handleDelete = async (_id) => {
    const response = window.confirm("Are you sure want to delete?");
    if (response) {
      try {
        await baseApi.post(
          "/api/posts/deletepost",
          { _id },
          { headers: { authorization: `Bearer ${user.refreshToken}` } }
        );
        history.push("/");
      } catch (err) {
        console.error(err.response.data);
      }
    }
  };

  return (
    <main className="container">
      <div className="row align-items-center">
        {selectedPost.map((post, i) => (
          <div key={i} className="col-md-12">
            <h1 className="heading p-3 mt-2 mb-0">
              {post.postTitle.charAt(0).toUpperCase() +
                post.postTitle.slice(1).toLowerCase()}
            </h1>
            <hr className="hr mx-3" />
            <div className="col-md-12 position-relative">
              {user ? (
                <button
                  type="button"
                  className="position-absolute cta-btn delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              ) : null}
              <div className="post px-5 pt-5 mx-2 my-5 lg-shadow rounded-lg">
                <p className="body-text md-line-height">{post.postDesc}</p>
                <hr className="hr" />
                <div className="row">
                  <div className="col-md-6">
                    <small className="small-text">
                      Authored by: {post.postCreatedBy}
                    </small>
                  </div>
                  <div className="col-md-6 text-right">
                    <small className="small-text">
                      Posted on: {post.postCreatedOn.split("T")[0]}
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="cta-btn entry-btn w-100 mx-0"
                  data-toggle="modal"
                  data-target="#commentModal"
                >
                  Add a response
                </button>

                {/* Model starts here */}
                <div
                  className="modal fade"
                  id="commentModal"
                  aria-labelledby="commentModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="sub-heading" id="commentModalLabel">
                          New comment
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
                          <div className="form-group">
                            <div className="text-center m-0 p-0">
                              {formik.errors.responseError ? (
                                <small className="text-danger">
                                  {formik.errors.responseError}
                                </small>
                              ) : null}
                            </div>
                            <span
                              className="body-text m-0 p-0"
                              name="commentDesc"
                              value={(formik.values.postId = post._id)}
                              onChange={formik.handleChange}
                            ></span>
                            <label
                              htmlFor="message-text"
                              className="col-form-label small-text"
                            >
                              Type your response here:
                            </label>
                            <textarea
                              className="form-control body-text"
                              id="message-text"
                              name="commentDesc"
                              value={formik.values.commentDesc}
                              onChange={formik.handleChange}
                            ></textarea>
                            {formik.errors.commentDesc ? (
                              <small className="text-danger">
                                {formik.errors.commentDesc}
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
                            <button
                              type="submit"
                              className="cta-btn btn-primary"
                            >
                              Post Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model ends here */}
              </div>
            </div>
            <h2 className="heading p-3 mt-2 mb-0">User Comments </h2>
            <hr className="hr mx-3" />
            {post.comments.length > 0 ? (
              post.comments
                .sort(
                  (a, b) =>
                    new Date(b.commentCreatedOn) - new Date(a.commentCreatedOn)
                )
                .map((comment, i) => (
                  <div key={i} className="col-md-6">
                    <div className="comment mx-2 mt-5 md-shadow rounded-lg">
                      <h2 className="body-text md-line-height mb-3">
                        {comment.commentDesc}
                      </h2>
                      <div className="card-footer p-2">
                        <div className="row">
                          <div className="col-md-6">
                            <small className="small-text">
                              By {comment.commentCreatedBy}
                            </small>
                          </div>
                          <div className="col-md-6">
                            <small className="small-text">
                              Posted on:{" "}
                              {comment.commentCreatedOn.split("T")[0]}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-md-6">
                <small className="small-text">No comments added.</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;
