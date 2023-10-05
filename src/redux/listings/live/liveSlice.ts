import { RootState } from "@/redux/store";
import { IListing } from "@/types/listing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

interface ListingsState {
  searchFilters: Partial<IListing> & { priceRange?: number[] };
}

const initialState: ListingsState = {
  searchFilters: {},
};

//slice
const liveSlice = createSlice({
  name: "live",
  initialState,

  reducers: {
    addToFilters: (
      state,
      action: PayloadAction<Partial<IListing> & { priceRange?: number[] }>
    ) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.searchFilters = {};
    },
  },
});

export const { addToFilters, resetFilters } = liveSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectSearchFilters = (state: RootState) =>
  state.live.searchFilters;

export default liveSlice.reducer;
