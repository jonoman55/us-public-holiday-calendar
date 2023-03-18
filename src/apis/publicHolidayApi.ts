import axios from "axios";

import { getEvn } from "../helpers";

import type { OptionsParams, FetchParams, RequestParams } from "../types";

const RAPID_API_HOST: string = getEvn("REACT_APP_RAPID_API_HOST") as string;
const RAPID_API_KEY: string = getEvn("REACT_APP_RAPID_API_KEY") as string;

const createOptions = ({ year, country }: OptionsParams) => ({
    method: "GET",
    url: `https://${RAPID_API_HOST}/${year}/${country}`,
    headers: {
        "X-RapidAPI-Host": RAPID_API_HOST,
        "X-RapidAPI-Key": RAPID_API_KEY,
    },
});

export const fetchHolidays = ({ date, signal }: FetchParams) => {
    return new Promise<any>((resolve, reject) => {
        const requestOptions = createOptions({
            year: date.getFullYear().toString(),
            country: "US"
        });
        resolve(axios.request(requestOptions));
        signal.onabort = () => {
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};

const CALENDAR_API_KEY: string = getEvn("REACT_APP_CALENDAR_API_KEY") as string;

const requestBuilder = ({ endpoint, country, year, type, language }: RequestParams): string => {
    return `https://calendarific.com/api/v2/${endpoint}?api_key=${CALENDAR_API_KEY}&country=${country}&year=${year}&type=${type}&language=${language}`;
};

export const fetchPublicHolidays = ({ date, signal }: FetchParams) => {
    const requestUrl: string = requestBuilder({
        endpoint: 'holidays',
        country: 'us',
        year: date.getFullYear().toString(),
        type: 'national',
        language: 'en'
    });
    return new Promise<any>((resolve, reject) => {
        resolve(axios.get(requestUrl));
        signal.onabort = () => {
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};
