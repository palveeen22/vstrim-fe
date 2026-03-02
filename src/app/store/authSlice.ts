import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../shared/types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoggedIn, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
