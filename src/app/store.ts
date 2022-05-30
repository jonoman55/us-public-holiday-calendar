import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import { themeSlice } from '../reducers/themeSlice';
import { calendarApi } from '../api/calendarApi';

export const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(
        calendarApi.middleware,
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;