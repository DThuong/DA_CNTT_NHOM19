import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false
  },
  reducers: {
    logout: (state) => {
        state.isLoading = false
    }
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder
      // When the action is pending
      .addCase(actions.getCategory.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null; // Clear any previous error
      })
      // When the action is fulfilled
      .addCase(actions.getCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      // When the action is rejected
      .addCase(actions.getCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message || "Failed to fetch categories";
      });
  }
});

// Action creators are generated for each case reducer function
// export const { } = appSlice.actions

export default appSlice.reducer
