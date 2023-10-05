import { apiSlice } from "../api/apiSlice";

interface IFilterQuery {
  currentPage: number;
  itemsPerPage: number;
}

export interface IActivity {
  _id: string;
  clientId: string;
  amount: number;
  activityType: string;
  newBalance: number;
  updatedAt: string;
}

interface IActivityResult {
  pages: number;
  activities: IActivity[];
  total: number;
}

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getWalletInfo: builder.query<{ balance: number }, void>({
      query: () => ({
        url: `/wallet`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) => [{ type: "Wallet", id: "LIST" }],
    }),

    //get activities
    getActivities: builder.query<IActivityResult, IFilterQuery>({
      query: ({ currentPage, itemsPerPage }) => ({
        url: `/wallet/activities?page=${currentPage}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) =>
        result?.total
          ? [
              ...result.activities.map(({ _id: id }) => ({
                type: "Wallet" as const,
                id,
              })),
              { type: "Wallet", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Wallet", id: "LIST" }],
    }),
    //deposit /stk push
    deposit: builder.mutation<
      { message: string },
      { amount: number; phoneNumber: string }
    >({
      query: (data) => ({
        url: `/wallet/deposit`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      //invalidatesTags: (result, error, arg) => [{ type: "Wallet", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWalletInfoQuery,
  useGetActivitiesQuery,
  useDepositMutation,
} = walletApiSlice;
