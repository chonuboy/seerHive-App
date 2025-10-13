import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchQueries } from "@/lib/models/candidate";

const initialState: SearchQueries = {}


const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<SearchQueries>) => {
      Object.assign(state, action.payload); // Ensure state is properly updated
    },
    clearSearchQuery: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;