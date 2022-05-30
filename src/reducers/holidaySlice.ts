import { createSlice } from '@reduxjs/toolkit';

import { holidayApi } from '../apis/holidayApi';

import type { Holiday } from '../types';

interface HolidayState {
    publicHolidays: Holiday[]
}

const initialState: HolidayState = {
    publicHolidays: [] 
};

// TODO : Finish implementing this reducer when api calls are being made from the holidayApi
export const holidaySlice = createSlice({
    name: 'holidays',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(holidayApi.endpoints.getPublicHolidays.matchPending, (state, action) => {
            console.log('pending');
        })
        builder.addMatcher(holidayApi.endpoints.getPublicHolidays.matchFulfilled, (state, action) => {
            console.log('fulfilled');
        })
        builder.addMatcher(holidayApi.endpoints.getPublicHolidays.matchRejected, (state, action) => {
            console.log('rejected');
        });
    },
});

export const holidayActions = holidaySlice.actions;
export default holidaySlice.reducer;