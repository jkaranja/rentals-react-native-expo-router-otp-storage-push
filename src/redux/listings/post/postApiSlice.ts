import { apiSlice } from "@/redux/api/apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    //listing//data is FormData object
    postNewListing: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `/listings/my/listings/list`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type from body
        body: data,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, arg) => [
        { type: "Active", id: "LIST" },
        { type: "Draft", id: "LIST" },
      ],
    }),
  }),

  // overrideExisting: true,
});

export const { usePostNewListingMutation } = postApiSlice;
