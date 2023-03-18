/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { holidayApi } from '../apis/holidayApi';

import type { PublicHoliday } from '../types';

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
    holidays: PublicHoliday[] | null;
    /**
     * Selected Public Holiday
     */
    selectedHoliday: PublicHoliday | null;
};

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
    selectedHoliday: null,
} as HolidayState;

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
        setHolidays: (state: HolidayState, action: PayloadAction<PublicHoliday[] | null>) => {
            state.holidays = action.payload;
        },
        /**
         * Set Selected Public Holiday
         */
        setSelectedHoliday: (state: HolidayState, action: PayloadAction<PublicHoliday | null>) => {
            state.selectedHoliday = action.payload;
        },
    },
    // extraReducers: (builder: ActionReducerMapBuilder<HolidayState>) => {
    //     builder.addMatcher(holidayApi.endpoints.getHolidays.matchPending, (state, action) => {
    //         state.status = 'pending';
    //         state.isLoading = true;
    //     })
    //     builder.addMatcher(holidayApi.endpoints.getHolidays.matchFulfilled, (state, action) => {
    //         state.status = 'fulfilled';
    //         state.isLoading = false;
    //         state.isSuccess = true;
    //         state.holidays = action.payload as Holiday[];
    //     })
    //     builder.addMatcher(holidayApi.endpoints.getHolidays.matchRejected, (state, action) => {
    //         state.status = 'rejected';
    //         state.isLoading = false;
    //         state.isSuccess = false;
    //         state.isError = true;
    //         if (isFetchBaseQueryError(action.payload?.data)) {
    //             const err: FetchBaseQueryError | undefined = action.payload?.data;
    //             if (isErrorWithMessage(err)) {
    //                 // you can access all properties of `FetchBaseQueryError` here
    //                 // const errMsg: string = 'error' in err ? err.error : JSON.stringify(err.data)
    //                 state.error = err?.message;
    //                 console.error(state.error);
    //             }
    //         }
    //     });
    // },
});

export const holidayActions = holidaySlice.actions;
export default holidaySlice.reducer;