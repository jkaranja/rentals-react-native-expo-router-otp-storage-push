import { IUser } from "../../types/user";
import { apiSlice } from "../api/apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //fetch Users
    getUser: builder.query<IUser, void>({
      query: () => ({
        url: `/users`,
        // validateStatus: (response, result) => {
        //   return response.status === 200 && !result.isError;
        // },
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, id) =>
        // is result available?//data already cached
        result
          ? [{ type: "User", id: result._id }]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "User", id: "PROFILE" }], //if initially fetch returned 'no record found' error
    }),
    //add new user
    registerUser: builder.mutation<
      { accessToken: string },
      { phoneNumber: string, username: string }
    >({
      query: (userInfo) => ({
        url: `/users/register`,
        method: "POST",
        body: userInfo,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      // invalidatesTags: (result, error, arg) => [
      //   { type: "User", id: "PROFILE" },
      // ],
    }),

    //update user
    updateUser: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `users`,
        method: "PATCH",
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type header from body
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "PROFILE" },
      ],
    }),
    //delete User//close account/not used
    deleteUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `users`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "PROFILE" },
      ],
    }),
  }),
  //   overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
