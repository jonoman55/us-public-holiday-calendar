// DOCS : https://calendarific.com/api-documentation

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { createPublicHoliday, getEvn } from '../helpers';

import type { CalendarHoliday, CalendarResponse, QueryParams } from '../types';

/**
 * Calendar API Key
 */
const CALENDAR_API_KEY: string = getEvn("REACT_APP_CALENDAR_API_KEY") as string;

/**
 * Base API URL
 */
const baseUrl: string = `https://calendarific.com/api/v2`;

/**
 * Calendar API
 */
export const calendarApi = createApi({
    reducerPath: 'calendarApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    endpoints: (builder) => ({
        getPublicHolidays: builder.query({
            query: ({ year, country }: QueryParams) => ({
                url: `/holidays?api_key=${CALENDAR_API_KEY}&country=${country}&year=${year}&type=national`,
                responseHandler: async (res: Response) => await res.json(),
            }),
            transformResponse: ({ response }: CalendarResponse) => response.holidays.map(
                (holiday: CalendarHoliday) => createPublicHoliday(holiday)
            ),
        }),
    }),
});

export const {
    useGetPublicHolidaysQuery
} = calendarApi;
