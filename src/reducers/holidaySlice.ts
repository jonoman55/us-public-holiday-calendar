import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { PublicHoliday } from '../types';

/**
 * Holiday State
 */
type HolidayState = {
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
});

export const holidayActions = holidaySlice.actions;
export default holidaySlice.reducer;