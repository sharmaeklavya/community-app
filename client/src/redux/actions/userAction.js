import { Types } from "../constants/types";

export const validateUser = (user) => {
  return {
    type: Types.VALID_USER,
    payload: user,
  };
};
