import { useDispatch } from "react-redux";
import { Types } from "../redux/constants/types";

export default function ValidToken(token) {
  const dispatch = useDispatch();
  return dispatch({ type: Types.VALID_USER, payload: token });
}
