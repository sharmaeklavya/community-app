import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/actions/postAction";
import Header from "./Header";
import AllPosts from "./AllPosts";
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
      <Route path="/">
        <AllPosts posts={allPosts} />
      </Route>
    </React.Fragment>
  );
}

export default Home;
