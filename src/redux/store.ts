import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import logger from "redux-logger";
import authReducer from "./auth/authSlice";
import themeReducer from "./theme/themeSlice";
import navReducer from "./maps/navSlice";
import liveReducer from "./listings/live/liveSlice";
import updateReducer from "./listings/update/updateSlice";
import draftReducer from "./listings/draft/draftSlice";

import notificationReducer from "./notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    nav: navReducer,
    //listings
    live: liveReducer,
    update: updateReducer,
    draft: draftReducer,
    notifications: notificationReducer,
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), //, logger
});

//for typing redux toolkit hooks: useDispatch/useSelector
// Infer the `RootState` and `AppDispatch` types from the store itself
//Inferring these types from the store itself means that they correctly update as you add more state slices or modify middleware settings.

export type RootState = ReturnType<typeof store.getState>; //type for state in useSelector
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState} + thunk middleware types//for useDispatch hook
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
