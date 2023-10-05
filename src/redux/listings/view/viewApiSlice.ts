import { IListing } from "@/types/listing";
import { apiSlice } from "../../api/apiSlice";

const providesList = (id: string) => {
  //defined tag types in apiSlice
  //must use const assertion here to prevent the type being broadened to string as it each entry should be present in tuple defined in apiSlice
  const tagTypes = ["Live", "Active", "Inactive", "Draft"] as const;

  return tagTypes.map((tagType) => ({ type: tagType, id }));
};

export const viewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //view listing
    getListing: builder.query<IListing, string>({
      query: (id) => ({
        url: `/listings/view/${id}`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, id) => providesList(id),
    }),
  }),

  overrideExisting: true,
});

export const { useGetListingQuery } = viewApiSlice;
