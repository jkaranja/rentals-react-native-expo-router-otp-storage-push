import { apiSlice } from "@/redux/api/apiSlice";
import { IListing, IListingFilter } from "@/types/listing";

export interface IWishlist {
  _id: string;
  listing: IListing;
}

export interface IWishlistResult {
  pages: number;
  listings: IWishlist[];
  total: number;
}

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    getWishlist: builder.query<IWishlistResult, IListingFilter | void>({
      query: (filters) => ({
        url: `/listings/wishlist?page=${filters?.page || 1}&size=${
          filters?.itemsPerPage || 50 //max of 50 wishlist
        }`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.listings?.length
          ? [
              ...result.listings.map(({ _id: id }) => ({
                type: "Wishlist" as const,
                id,
              })),
              { type: "Wishlist", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Wishlist", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),
    //add to wish list
    AddWishlist: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/wishlist/add/${id}`,
        method: "PATCH",
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, arg) => [
        { type: "Wishlist", id: "LIST" },
      ],
    }),

    //remove from wishlist
    removeWishlist: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/wishlist/remove/${id}`,
        method: "PATCH",
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, id) => [{ type: "Wishlist", id }],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApiSlice;
