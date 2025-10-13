import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: null | {
    username: string;
    role: string;
    password?: string;
    userId?: number;
  };
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user.username)
      );
      localStorage.setItem(
        "userId",
        JSON.stringify(action.payload.user.userId)
      );
      localStorage.setItem(
        "userRole",
        JSON.stringify(action.payload.user.role)
      ); // Store user in localStorage
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === "persist/REHYDRATE",
      (state, action) => {
        if (typeof localStorage !== "undefined") {
          const storedUser = localStorage.getItem("user");
          const storedUserRole = localStorage.getItem("userRole");
          if (storedUser && storedUserRole) {
            state.user = {
              username: JSON.parse(storedUser),
              role: JSON.parse(storedUserRole),
            };
            state.isAuthenticated = true;
          }
        }
      }
    );
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
