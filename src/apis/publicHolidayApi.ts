import axios from "axios";

import { getEvn } from "../helpers";

import type { CalendarHolidayRes, FetchProps } from "../types";

const RAPID_API_HOST = getEvn("REACT_APP_RAPID_API_HOST");
const RAPID_API_KEY = getEvn("REACT_APP_RAPID_API_KEY");

const options = (year: string, country: string) => {
    return {
        method: "GET",
        url: `https://${RAPID_API_HOST}/${year ?? new Date().getFullYear().toString()}/${country ?? 'US'}`,
        headers: {
            "X-RapidAPI-Host": RAPID_API_HOST,
            "X-RapidAPI-Key": RAPID_API_KEY,
        },
    };
};

export const fetchHolidays = ({ date, signal }: FetchProps) => {
    const year: string = date.getFullYear().toString();
    const country: string = "US";
    return new Promise<any>((resolve, reject) => {
        resolve(axios.request(options(year, country)));
        signal.onabort = () => {
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};

const API_KEY = getEvn("REACT_APP_CANDENAR_API_KEY");

export const fetchPublicHolidays = ({ date, signal }: FetchProps) => {
    const year = date.getFullYear().toString();
    const country: string = "US";
    return new Promise<CalendarHolidayRes>((resolve, reject) => {
        resolve(axios.get(
            `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}&type=national`
        ));
        signal.onabort = () => {
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};
