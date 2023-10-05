import { RootState } from "@/redux/store";
import { ListingImage } from "@/types/file";
import { IListing } from "@/types/listing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

interface ListingsState {
  updatedListing: Partial<IListing> & {
    newPics?: ListingImage[];
    removedPics?: ListingImage[];
  };
}

const initialState: ListingsState = {
  updatedListing: {},
};

//slice
const updateSlice = createSlice({
  name: "update",
  initialState,

  reducers: {
    addToUpdated: (
      state,
      action: PayloadAction<
        Partial<IListing> & {
          newPics?: ListingImage[];
          removedPics?: ListingImage[];
        }
      >
    ) => {
      state.updatedListing = { ...state.updatedListing, ...action.payload };
    },
    resetUpdated: (state) => {
      state.updatedListing = {};
    },
  },
});

export const { addToUpdated, resetUpdated } = updateSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectUpdatedListing = (state: RootState) =>
  state.update.updatedListing;

export default updateSlice.reducer;
