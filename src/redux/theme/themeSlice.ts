import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface ThemeState {
  mode: "light" | "dark";
}

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

const initialState: ThemeState = {
  mode: "light",
};

//slice
const themeSlice = createSlice({
  name: "theme",
  initialState,

  reducers: {
    setMode: (state, action: PayloadAction<"dark" | "light">) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMode = (state: RootState) => state.theme.mode;

export default themeSlice.reducer;
