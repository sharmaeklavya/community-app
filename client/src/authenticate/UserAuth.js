import baseApi from "../apis/baseApi";
export const controller = new AbortController();

export const UserAuth = {
  getToken: async () => {
    try {
      const response = await baseApi.post(
        "/api/auth/refreshtoken",
        {},
        { signal: controller.signal }
      );
      return response.data;
    } catch (err) {
      console.error(err.response.data);
    }
  },
};
