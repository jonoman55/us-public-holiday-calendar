import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { PublicHoliday, Holiday } from '../types';

/**
 * Check if type is of PublicHoliday
 * @param holiday PublicHoliday or Holiday
 * @returns true or false
 */
export function isPublicHolidayType(holiday: PublicHoliday | Holiday): holiday is PublicHoliday {
    return (holiday as PublicHoliday).date?.iso !== undefined;
};

/**
 * Holiday State
 */
type HolidayState = {
    /**
     * Loading State
     */
    isLoading: boolean;
    /**
     * Currently Selected Date
     */
    currentDate: Date;
    /**
     * Public Holidays from Holiday API
     */
    holidays: Holiday[] | null;
    /**
     * Public Holidays from Calendar API
     */
    publicHolidays: PublicHoliday[] | null;
    /**
     * Selected Public Holiday
     */
    selectedHoliday: PublicHoliday | Holiday | null;
};

/** 
 * Initial Holiday State
 */
const initialState: HolidayState = {
    isLoading: false,
    currentDate: new Date(),
    holidays: [],
    publicHolidays: [],
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
         * Set Public Holidays from Calendar API 
         */
        setPublicHolidays: (state: HolidayState, action: PayloadAction<PublicHoliday[] | null>) => {
            state.publicHolidays = action.payload;
        },
        /**
         * Set Public Holidays from Holiday API
         */
        setHolidays: (state: HolidayState, action: PayloadAction<Holiday [] | null>) => {
            state.holidays = action.payload;
        },
        /**
         * Set Selected Public Holiday
         */
        setSelectedHoliday: (state: HolidayState, action: PayloadAction<PublicHoliday| Holiday | null>) => {
            state.selectedHoliday = action.payload;
        },
        /**
         * Set Current Date
         */
        setCurrentDate: (state: HolidayState, action: PayloadAction<Date>) => {
            state.currentDate = action.payload;
        },
        /**
         * Set Loading State
         */
        setIsLoading: (state: HolidayState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const holidayActions = holidaySlice.actions;
export default holidaySlice.reducer;