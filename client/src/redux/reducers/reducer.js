import { Types } from "../constants/types";

const INITIAL_STATE = {
  posts: [],
};

export const postReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case Types.FETCH_POSTS:
      return { ...state, posts: payload };

    default:
      return state;
  }
};

export const userReducer = (state = [], { type, payload }) => {
  switch (type) {
    case Types.VALID_USER:
      return { ...state, user: payload };

    default:
      return state;
  }
};
