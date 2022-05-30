/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEvn } from '../helpers';

import type { Holiday, QueryParams } from "../types";

const API_HOST = getEvn("REACT_APP_RAPID_API_HOST");
const API_KEY = getEvn("REACT_APP_RAPID_API_KEY");

interface ResponsePayload {
    data: Holiday[]
}

// TODO : Implement this redux api instead of using axios (needs AbortSignal)
// DOCS : https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// DOCS : https://redux-toolkit.js.org/rtk-query/usage/examples
// EXAMPLES : https://github.com/reduxjs/redux-toolkit/tree/master/examples/query/react
export const holidayApi = createApi({
    reducerPath: 'holidayApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://${API_HOST}`,
        prepareHeaders: (headers) => {
            headers.set("X-RapidAPI-Host", API_HOST);
            headers.set("X-RapidAPI-Key", API_KEY);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPublicHolidays: builder.query({
            query: ({ year, country = 'US' }: QueryParams) => ({
                url: `/${year}/${country}`,
                responseHandler: async (res) => await res.json(),
            }),
            transformResponse: (response: ResponsePayload) => {
                return response.data.map((holiday: Holiday) => {
                    return {
                        counties: holiday.counties,
                        countryCode: holiday.countryCode,
                        date: holiday.date,
                        fixed: holiday.fixed,
                        global: holiday.global,
                        launchYear: holiday.launchYear,
                        localName: holiday.localName,
                        name: holiday.name,
                        type: holiday.type,
                        day: parseInt(moment(holiday.date).format("D"), 10)
                    };
                });
            },
        }),
    }),
});

export const { useGetPublicHolidaysQuery } = holidayApi;
