import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import persistedReducer from './auth/credentialSlice';
import { persistStore } from 'redux-persist';
import searchslicereducer from './candidateSearchSlice';
import recruitSearchSlicereducer from './recruitmentCandidateSearchSlice';
import jobReducer from "./job-slice"
import candidateReducer from "./candidateSlice"

import { apiSlice } from './apiSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        credentials: persistedReducer,
        search:searchslicereducer,
        recruitSearch:recruitSearchSlicereducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        job:jobReducer,
        candidate:candidateReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;