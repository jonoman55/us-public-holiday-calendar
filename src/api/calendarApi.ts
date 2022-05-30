import moment from 'moment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { QueryParams, ErrorName, PublicHoliday } from "../types";

const getEvn = (name: string) => process.env[name] as string;

const API_HOST = getEvn("REACT_APP_RAPID_API_HOST");
const API_KEY = getEvn("REACT_APP_RAPID_API_KEY");

// TODO : Implement this api instead of using axios
export const calendarApi = createApi({
    reducerPath: 'calendarApi',
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
            query: ({ year, date }: QueryParams) => ({
                url: `/${year ?? new Date().getFullYear().toString()}/US`,
                responseHandler: (response: any) => {
                    try {
                        // eslint-disable-next-line array-callback-return
                        return response.data.map((holiday: PublicHoliday) => {
                            if (date.getMonth() === new Date(holiday.date).getMonth()) {
                                return {
                                    name: holiday.name,
                                    localName: holiday.localName,
                                    date: holiday.date,
                                    day: parseInt(moment(holiday.date).format("D"), 10)
                                };
                            }
                        });
                    } catch (error) {
                        const { name } = error as ErrorName;
                        // ignore the error if it's caused by `controller.abort`
                        if (name !== "AbortError") {
                            throw error;
                        }
                    }
                }
            }),
        }),
    }),
});

export const { useGetPublicHolidaysQuery } = calendarApi;
