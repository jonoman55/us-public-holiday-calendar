import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import themeReducer from '../reducers/themeSlice';
import holidayReducer from '../reducers/holidaySlice';
import { holidayApi } from '../apis/holidayApi';
import { calendarApi } from '../apis/calendarApi';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        holidays: holidayReducer,
        [holidayApi.reducerPath]: holidayApi.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(
        holidayApi.middleware,
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