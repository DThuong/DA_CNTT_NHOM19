import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetCart, apiUpdateCart, apiDeleteCart } from '../../apis';

// Async actions
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await apiGetCart();
    if (response.data.success) {
      return response.data.cart;
    } else {
      return rejectWithValue(response.data.msg || 'Failed to fetch cart');
    }
  } catch (error) {
    return rejectWithValue(error.response.data.msg || 'Failed to fetch cart');
  }
});

export const updateCart = createAsyncThunk('cart/updateCart', async (data, { rejectWithValue }) => {
  try {
    const response = await apiUpdateCart(data);
    if (response.data.success) {
      return response.data.cart;
    } else {
      return rejectWithValue(response.data.msg || 'Failed to update cart');
    }
  } catch (error) {
    return rejectWithValue(error.response.data.msg || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (pid, { rejectWithValue }) => {
  try {
    const response = await apiDeleteCart(pid);
    if (response.data.success) {
      return response.data.cart;
    } else {
      return rejectWithValue(response.data.msg || 'Failed to remove from cart');
    }
  } catch (error) {
    return rejectWithValue(error.response.data.msg || 'Failed to remove from cart');
  }
});

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Nếu cần các reducer đồng bộ, thêm ở đây
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
