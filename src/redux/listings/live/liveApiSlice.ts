import { IListing, IListingResult } from "@/types/listing";
import { apiSlice } from "../../api/apiSlice";

interface IListingFilter {
  page: number;
  itemsPerPage: number;
  filters: Partial<IListing> & { priceRange?: number[] };
}

export const liveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getAllListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
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
                type: "Live" as const,
                id,
              })),
              { type: "Live", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Live", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),
  }),

  // overrideExisting: true,
});

export const { useGetAllListingsQuery } = liveApiSlice;
