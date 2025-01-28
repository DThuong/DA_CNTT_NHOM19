import { createAsyncThunk } from "@reduxjs/toolkit";
// import
import * as apis from "../../apis";

export const getCategory = createAsyncThunk(
  "app/category",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCategory();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.category;
  }
);
