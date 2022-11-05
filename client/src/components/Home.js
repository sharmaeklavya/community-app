import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { fetchPosts } from "../redux/actions/postAction";
import AllPosts from "./AllPosts";
import Header from "./Header";
import Post from "./Post";

function Home() {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.allPosts.posts);

  useEffect(() => {
    dispatch(fetchPosts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Header />
      <Route path="/posts" exact>
        <Post posts={allPosts} />
      </Route>
      <Route path="/" exact>
        <AllPosts posts={allPosts} />
      </Route>
    </React.Fragment>
  );
}

export default Home;
