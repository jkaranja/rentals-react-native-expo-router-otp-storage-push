import { apiSlice } from "@/redux/api/apiSlice";
import { IListingFilter, IListingResult } from "@/types/listing";

export const activeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getActiveListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings/active?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
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
                type: "Active" as const,
                id,
              })),
              { type: "Active", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Active", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //update listing status->inactive
    deactivateListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/active/status/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Active", id }],
    }),

    //delete order
    deleteActiveListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/active/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Active", id }],
    }),
  }),

  // overrideExisting: true,
});

export const {
  useGetActiveListingsQuery,
  useDeactivateListingMutation,
  useDeleteActiveListingMutation,
} = activeApiSlice;
