import { createAsyncThunk } from "@reduxjs/toolkit";
// import
import * as apis from "../../apis";

export const getCurrent = createAsyncThunk(
  "app/current",
  async (data, { rejectWithValue }) => {
    const response = await apis.apigetCurrent();
    if (!response.success) {
      return rejectWithValue(response);
    }
    return response.msg;
  }
);

// Update current user details
export const updateCurrent = createAsyncThunk(
  "user/updateCurrent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apis.apiUpdateUser(data);
      if (!response.success) {
        return rejectWithValue(response.data);
      }
      return response.msg;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
