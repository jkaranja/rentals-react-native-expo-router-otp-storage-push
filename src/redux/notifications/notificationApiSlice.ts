import { apiSlice } from "../api/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //save push token
    savePushToken: builder.mutation<{ message: string }, { pushToken: string }>(
      {
        query: (data) => ({
          url: `/notifications/email`,
          method: "PUT",
          body: data,
        }),
        transformErrorResponse: (response, meta, arg) =>
          (response.data as { message: string })?.message,
        //refetch or invalidate cache
        // invalidatesTags: (result, error, arg) => [
        //   { type: "Notification", id: "LIST" },
        // ],
      }
    ),
  }),

  overrideExisting: true,
});

export const { useSavePushTokenMutation } = notificationApiSlice;
