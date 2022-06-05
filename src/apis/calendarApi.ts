import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEvn } from '../helpers';

import type { QueryParams } from '../types';

const API_KEY = getEvn("REACT_APP_CALENDAR_API_KEY");

// DOCS : https://calendarific.com/api-documentation
export const calendarApi = createApi({
    reducerPath: 'calendarApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://calendarific.com/api/v2`
    }),
    endpoints: (builder) => ({
        getPublicHolidays: builder.query({
            query: ({ year, country }: QueryParams) => ({
                url: `/holidays?api_key=${API_KEY}&country=${country}&year=${year}&type=national`,
                responseHandler: async (res) => await res.json()
            }),
        }),
    }),
});

export const { useGetPublicHolidaysQuery } = calendarApi;
