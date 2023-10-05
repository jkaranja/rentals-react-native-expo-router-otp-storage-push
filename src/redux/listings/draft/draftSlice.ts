import { RootState } from "@/redux/store";
import { IListing } from "@/types/listing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

interface ListingsState {
  draftListing: Partial<IListing>;
}

const initialState: ListingsState = {
  draftListing: {},
};

//slice
const draftSlice = createSlice({
  name: "listings",
  initialState,

  reducers: {
    addToDraft: (state, action: PayloadAction<Partial<IListing>>) => {
      state.draftListing = { ...state.draftListing, ...action.payload };
    },
    resetDraft: (state) => {
      state.draftListing = {};
    },
  },
});

export const { addToDraft, resetDraft } = draftSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDraftListing = (state: RootState) =>
  state.draft.draftListing;

export default draftSlice.reducer;
