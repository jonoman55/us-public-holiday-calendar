import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import themeReducer from '../reducers/themeSlice';
import holidayReducer from '../reducers/holidaySlice';
import { holidayApi } from '../apis/holidayApi';
import { calendarApi } from '../apis/calendarApi';
import { wikiApi } from '../apis/wikiApi';

/**
 * App Store
 */
export const store = configureStore({
    reducer: {
        theme: themeReducer,
        holidays: holidayReducer,
        [holidayApi.reducerPath]: holidayApi.reducer,
        [calendarApi.reducerPath]: calendarApi.reducer,
        [wikiApi.reducerPath]: wikiApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(
        holidayApi.middleware,
        calendarApi.middleware,
        wikiApi.middleware,
    ),
});

// NOTE : for refetchOnReconnect
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;