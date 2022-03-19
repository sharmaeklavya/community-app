import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
function Post(props) {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const [selectedPost, setSelectedPost] = useState([]);

  useEffect(() => {
    const post = props.posts.filter((post) => post._id === id);
    setSelectedPost(post);
  }, [props.posts, id]);

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
            <div className="col-md-12">
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
                  tabIndex="-1"
                  aria-labelledby="commentModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="commentModalLabel">
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
                        <form>
                          <div className="form-group">
                            <label
                              htmlFor="message-text"
                              className="col-form-label"
                            >
                              Type your comment here:
                            </label>
                            <textarea
                              className="form-control"
                              id="message-text"
                            ></textarea>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary">
                          Post Now
                        </button>
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
              post.comments.map((comment, i) => (
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
                            Posted on: {comment.commentCreatedOn.split("T")[0]}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-6">
                <Loader />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;
