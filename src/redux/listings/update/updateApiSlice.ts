import { apiSlice } from "@/redux/api/apiSlice";

const providesList = (id: string) => {
  //defined tag types in apiSlice
  //must use const assertion here to prevent the type being broadened to string as it each entry should be present in tuple defined in apiSlice
  const tagTypes = ["Active", "Inactive", "Draft"] as const;

  return tagTypes.map((tagType) => ({ type: tagType, id }));
};

export const updateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    //update order
    updateListing: builder.mutation<
      { message: string },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/listings/my/listings/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => providesList(arg.id),
    }),
  }),

  // overrideExisting: true,
});

export const { useUpdateListingMutation } = updateApiSlice;
