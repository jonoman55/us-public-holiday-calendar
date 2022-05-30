import axios from "axios";
import moment from "moment";

import { getEvn } from '../helpers';

import type { ErrorName, HolidayResponse } from "../types";

const options = (year: string, country: string) => {
    const host = getEvn("REACT_APP_RAPID_API_HOST");
    const key = getEvn("REACT_APP_RAPID_API_KEY");
    return {
        method: "GET",
        url: `https://${host}/${year}/${country ?? 'US'}`,
        headers: {
            "X-RapidAPI-Host": host,
            "X-RapidAPI-Key": key,
        },
    }
};

export const fetchHolidays = (date: Date, { signal }: { signal: AbortSignal }) => {
    const year: string = date.getFullYear().toString();
    const country: string = "US";
    return new Promise<any>((resolve, reject) => {
        resolve(axios.request(options(year, country)));
        signal.onabort = () => {
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
};

/**
 * // TODO : Remove from project
 * @deprecated causes infinite loop due to missing AbortSignal 
 */
export const fetchPublicHolidays = async (date: Date) => {
    try {
        const response = await axios.request(
            options(date.getFullYear().toString(), "US")
        );
        // eslint-disable-next-line
        return response.data.map((holiday: HolidayResponse) => {
            if (date.getMonth() === new Date(holiday.date).getMonth()) {
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
                    day: parseInt(moment(date).format("D"), 10)
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
};