import { apiSlice } from "@/redux/api/apiSlice";
import { IListingFilter, IListingResult } from "@/types/listing";

export const draftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getDraftListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings/draft?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
          filters
        )}`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.listings?.length
          ? [
              ...result.listings.map(({ _id: id }) => ({
                type: "Draft" as const,
                id,
              })),
              { type: "Draft", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Draft", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //activate status
    publishDraft: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/draft/status/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, id) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Draft", id }],
    }),

    //delete order
    deleteDraftListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/draft/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Draft", id }],
    }),
  }),

  // overrideExisting: true,
});

export const {
  useGetDraftListingsQuery,
  useDeleteDraftListingMutation,
  usePublishDraftMutation,
} = draftApiSlice;
