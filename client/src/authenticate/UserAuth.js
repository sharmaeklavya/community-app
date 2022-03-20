import baseApi from "../apis/baseApi";
import ValidToken from "./ValidToken";

export const UserAuth = {
  getToken: async () => {
    try {
      const response = await baseApi.post("api/auth/refreshtoken", {});
      if (response) {
        ValidToken(response.data);
        return response.data;
      }
    } catch (err) {
      console.error(err.response);
    }
  },
};
