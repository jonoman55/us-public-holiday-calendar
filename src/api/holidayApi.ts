import axios from "axios";
import moment from "moment";

import { ErrorName, PublicHoliday } from "../types";

const getEvn = (name: string) => process.env[name] as string;

const options = (year: string) => {
    const host = getEvn("REACT_APP_RAPID_API_HOST");
    const key = getEvn("REACT_APP_RAPID_API_KEY");
    return {
        method: "GET",
        url: `https://${host}/${year ?? new Date().getFullYear().toString()}/US`,
        headers: {
            "X-RapidAPI-Host": host,
            "X-RapidAPI-Key": key,
        },
    }
};

export const fetchPublicHolidays = async (date: Date) => {
    try {
        const response = await axios.request(
            options(date.getFullYear().toString())
        );
        // eslint-disable-next-line
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
};