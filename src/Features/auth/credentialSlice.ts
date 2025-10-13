import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface Credentials {
  Email: string;
  Password: string;
}

const initialState: Credentials = {
  Email: '',
  Password: '',
}

const credentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.Email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.Password = action.payload;
    },
    logout: (state) => {
      state.Email = '';
      state.Password = '';
    },
  }
});

const persistConfig = {
  key: 'credentials',
  storage,
  
};

const persistedReducer = persistReducer(persistConfig, credentialSlice.reducer);

export const { setEmail, setPassword,logout } = credentialSlice.actions;
export default persistedReducer;