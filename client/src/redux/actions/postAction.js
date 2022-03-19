import baseApi from "../../apis/baseApi";
import { Types } from "../constants/types";

export const fetchPosts = () => {
  return async (dispatch) => {
    const posts = await baseApi.get("api/posts/allposts");

    dispatch({
      type: Types.FETCH_POSTS,
      payload: posts.data,
    });
  };
};
