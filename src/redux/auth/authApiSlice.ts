import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
import * as SecureStore from "expo-secure-store";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //login user
    login: builder.mutation<
      { accessToken: string },
      { phoneNumber: string; otp: string }
    >({
      query: (loginInfo) => ({
        url: `/auth/login`,
        method: "POST",
        body: loginInfo,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),

    //resend otp+ dispatch token to store
    sendOTP: builder.mutation<{ message: string }, { phoneNumber: string }>({
      query: (data) => ({
        url: `/auth/send/otp`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),

    //verify otp+ dispatch token to store
    verifyOTP: builder.mutation<
      { message: string },
      { phoneNumber: string; otp: string }
    >({
      query: (data) => ({
        url: `/auth/verify/otp`,
        method: "PATCH",
        body: data,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),

    //logout
    sendLogout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //console.log(data);
          dispatch(logOut());
          //clear token from secure store
          await SecureStore.deleteItemAsync("token");
          //when store is being removed from memory, reset to clean any rogue timers//avoid memory leaks
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          //console.log(err);
        }
      },
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),
    //refresh token//persist on page reload or remember me//useLazyQuery() not working->says not a function
    //so use mutation with GET instead of query so we can have a trigger function
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials(accessToken));
        } catch (err) {
          // console.log(err);
        }
      },
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),
  }),
  //   overrideExisting: false,
});

export const {
  useSendLogoutMutation,
  useRefreshMutation,
  useVerifyOTPMutation,
  useLoginMutation,
  useSendOTPMutation,
} = authApiSlice;
