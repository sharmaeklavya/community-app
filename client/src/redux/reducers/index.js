import { combineReducers } from "redux";
import { postReducer, userReducer } from "./reducer";

const reducers = combineReducers({
  allPosts: postReducer,
  validUser: userReducer,
});

export default reducers;
