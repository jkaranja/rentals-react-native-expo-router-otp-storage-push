import { apiSlice } from "@/redux/api/apiSlice";
import { IListingFilter, IListingResult } from "@/types/listing";

export const inactiveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getInactiveListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings/inactive?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
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
                type: "Inactive" as const,
                id,
              })),
              { type: "Inactive", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Inactive", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //update listing status
    activateListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/inactive/status/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, id) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Inactive", id }],
    }),

    //delete order
    deleteInactiveListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/inactive/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Inactive", id }],
    }),
  }),

  // overrideExisting: true,
});

export const {
  useGetInactiveListingsQuery,
  useActivateListingMutation,
  useDeleteInactiveListingMutation,
} = inactiveApiSlice;
