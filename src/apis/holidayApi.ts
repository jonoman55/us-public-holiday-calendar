// NOTE : This API doesn't provide holiday description

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { createHoliday, getEvn } from '../helpers';

import type { Holiday, QueryParams } from "../types";

/**
 * Rapid API Host URL
 */
const RAPID_API_HOST = getEvn("REACT_APP_RAPID_API_HOST") as string;
/**
 * Rapid API Key
 */
const RAPID_API_KEY = getEvn("REACT_APP_RAPID_API_KEY") as string;

/**
 * Base API URL
 */
const baseUrl: string = `https://${RAPID_API_HOST}`;

/**
 * Response Payload (for transformResponse)
 */
type ResponsePayload = Holiday[];

/**
 * Holiday API
 */
export const holidayApi = createApi({
    reducerPath: 'holidayApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers: Headers) => {
            headers.set("X-RapidAPI-Host", RAPID_API_HOST);
            headers.set("X-RapidAPI-Key", RAPID_API_KEY);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getHolidays: builder.query({
            query: ({ year, country = 'US' }: QueryParams) => ({
                url: `/${year}/${country}`,
                responseHandler: async (res: Response) => await res.json(),
            }),
            transformResponse: (response: ResponsePayload) => {
                return response?.map(
                    (holiday: Holiday) => createHoliday(holiday)
                );
            },
        }),
    }),
});

export const {
    useGetHolidaysQuery
} = holidayApi;
