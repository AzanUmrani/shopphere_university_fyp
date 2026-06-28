import { createSlice } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';


interface SocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  error: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) state.error = null;
    },
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
  },
});

export const { setConnected, setConnectionError } = socketSlice.actions;
export default socketSlice.reducer;