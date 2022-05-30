import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import themeReducer from '../reducers/themeSlice';
import holidayReducer from '../reducers/holidaySlice';
import { holidayApi } from '../apis/holidayApi';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        holidays: holidayReducer,
        [holidayApi.reducerPath]: holidayApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(
        holidayApi.middleware,
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