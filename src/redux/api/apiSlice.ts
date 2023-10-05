// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../../api/constants";
import { RootState } from "../store";

// initialize an empty api service that we'll inject endpoints into later as needed
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set("authorization", `Bearer ${token}`);
      // }
      if (!headers.has("Authorization") && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  //global settings
  //refetchOnMountOrArgChange: true, //always refetch on mount//avoid stale state
  refetchOnReconnect: true, //refetch after regaining a network connection.
  tagTypes: [
    "User",
    "Live",
    "Active",
    "Inactive",
    "Draft",
    "Wishlist",
    "Chat",
    "Wallet",
  ], //defines tags//can be ["Post", "User"],//possible tags that could be provided by endpoints

  endpoints: () => ({}),
});
