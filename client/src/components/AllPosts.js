import React from "react";
import { useHistory } from "react-router-dom";
import Skelton from "./Skelton";

function AllPosts(props) {
  const history = useHistory();

  const handleClick = (post) => {
    history.push(`/posts?id=${post._id}`);
  };

  return (
    <main className="container">
      <div className="row align-items-center">
        <div className="col-md-12">
          <h1 className="heading p-3 mt-2 mb-0">Latest Posts</h1>
          <hr className="hr mx-3" />
        </div>
        {props.posts.length > 0 ? (
          props.posts.map((post, i) => (
            <div key={i} className="col-sm-6 col-md-4 col-lg-3">
              <div
                className="post mx-2 my-3 md-shadow"
                onClick={() => handleClick(post)}
              >
                <h2 className="body-text font-weight-bold mb-3">
                  {post.postTitle.substring(0, 18)}
                </h2>
                <hr className="hr" />
                <p className="body-text md-line-height desc">{post.postDesc}</p>
                <hr className="hr" />
                <h3 className="small-text font-weight-bold mb-0">
                  Posted by {post.postCreatedBy}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12">
                <Skelton />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AllPosts;
