import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { holidayApi } from '../apis/holidayApi';

import type { Holiday } from '../types';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
function isFetchBaseQueryError(
    error: unknown
): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error
};

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
function isErrorWithMessage(
    error: unknown
): error is { message: string } {
    return (
        typeof error === 'object' &&
        error != null &&
        'message' in error &&
        typeof (error as any).message === 'string'
    );
};

/**
 * Holiday State
 */
type HolidayState = {
    /**
     * Status State
     */
    status: "idle" | "pending" | "fulfilled" | "rejected";
    /**
     * Loading State
     */
    isLoading: boolean;
    /**
     * Success State
     */
    isSuccess: boolean;
    /**
     * Error State
     */
    isError: boolean;
    /**
     * Error Message
     */
    error: FetchBaseQueryError | string | undefined;
    /**
     * Public Holidays
     */
    holidays: Holiday[];
}

/** 
 * Initial Holiday State
 */
const initialState: HolidayState = {
    status: 'idle',
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: '',
    holidays: [],
};

/**
 * Holiday Slice
 */
export const holidaySlice = createSlice({
    name: 'holidays',
    initialState,
    reducers: {
        /**
         * Reset Holiday State
         */
        reset: (state: HolidayState) => {
            state = initialState;
            return {
                ...initialState
            };
        },
        /**
         * Set Public Holidays 
         */
        setHolidays: (state: HolidayState, action: PayloadAction<Holiday[]>) => {
            state.holidays = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(holidayApi.endpoints.getHolidays.matchPending, (state, action) => {
            state.status = 'pending';
            state.isLoading = true;
        })
        builder.addMatcher(holidayApi.endpoints.getHolidays.matchFulfilled, (state, action) => {
            state.status = 'fulfilled';
            state.isLoading = false;
            state.isSuccess = true;
            state.holidays = action.payload as Holiday[];
        })
        builder.addMatcher(holidayApi.endpoints.getHolidays.matchRejected, (state, action) => {
            state.status = 'rejected';
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            if (isFetchBaseQueryError(action.payload?.data)) {
                const err: FetchBaseQueryError | undefined = action.payload?.data;
                // you can access all properties of `FetchBaseQueryError` here
                if (isErrorWithMessage(err)) {
                    // const errMsg: string = 'error' in err ? err.error : JSON.stringify(err.data)
                    state.error = err.message;
                }
            }
        });
    },
});

export const holidayActions = holidaySlice.actions;
export default holidaySlice.reducer;