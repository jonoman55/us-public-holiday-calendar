/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Badge, TextField } from "@mui/material";
import moment from "moment";

import HolidayCard from "./HolidayCard";
import { fetchHolidays, fetchPublicHolidays } from "../apis/publicHolidayApi";

// import { holidayApi } from "../api/holidayApi";
// import { useAppDispatch } from "../app/hooks";

import type { CalendarHoliday, CalendarHolidayExt, CalendarResponse, Holiday, HolidayResponse } from "../types";

const initialValue = new Date();

// TODO : Add custom ToolTip to buttons
// TODO : Hook up wiki api to populate card data for each holiday
// TODO : Find an image api for the holiday card
// DOCS : https://mui.com/x/react-date-pickers/date-picker/#ServerRequestDatePicker.tsx
const Calendar = () => {
    const requestAbortController = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(initialValue);
    const [pubHolidays, sePubHolidays] = useState<CalendarHolidayExt[] | undefined>([]);
    const [publicHolidays, setPublicHolidays] = useState<Holiday[] | undefined>([]);
    const [holidays, setHolidays] = useState<number[] | undefined>([]);

    // TODO : Finish implementing this fetch function and replace it with fetchHighlightedDays
    const fetctSelectedDays = (date: Date) => {
        const controller = new AbortController();
        fetchPublicHolidays({
            date,
            signal: controller.signal
        })
            .then((res) => {
                const response = res?.data?.map((holiday: CalendarHoliday) => {
                    console.log(holiday);
                    if (date.getMonth() === new Date(holiday.date.iso).getMonth()) {
                        return {
                            ...holiday,
                            day: parseInt(moment(holiday.date.iso).format("D"))
                        } as CalendarHolidayExt | undefined;
                    }
                    else return undefined;
                }).filter((d: CalendarHolidayExt) => d !== undefined);
                sePubHolidays(response as CalendarHolidayExt[]);
                setHolidays(response?.map((d: CalendarHolidayExt) => {
                    if (d !== undefined) return d.day;
                    else return d;
                }).filter((d: CalendarHolidayExt) => d !== undefined) as number[]);
                setIsLoading(false);
            })
            .catch((error) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });
        requestAbortController.current = controller;
    };

    console.log(pubHolidays);

    const fetchHighlightedDays = (date: Date) => {
        const controller = new AbortController();
        fetchHolidays({
            date,
            signal: controller.signal
        })
            .then((res) => {
                const holidayRes: HolidayResponse[] = res.data.map((holiday: HolidayResponse) => {
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
                            day: parseInt(moment(holiday.date).format("D"))
                        }
                    } else return undefined;
                });
                setPublicHolidays(holidayRes.filter(d => d !== undefined));
                setHolidays(holidayRes.map((d) => {
                    if (d !== undefined) return d.day;
                    else return d;
                }).filter(d => d !== undefined) as number[]);
                setIsLoading(false);
            })
            .catch((error) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });
        requestAbortController.current = controller;
    };

    useEffect(() => {
        fetchHighlightedDays(initialValue);
        fetctSelectedDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleChange = useCallback((date: Date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();

            setIsLoading(true);
            setHolidays([]);
            setPublicHolidays([]);
            fetchHighlightedDays(date);
        }
    }, []);

    const selectedHoliday = useMemo(() => {
        return publicHolidays?.filter((holiday: Holiday) =>
            holiday.date === moment(value).format("YYYY-MM-DD")
            && holiday.type === "Public"
        ).shift();
    }, [publicHolidays, value]);

    // console.log(selectedHoliday);

    return (
        <Fragment>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                    value={value}
                    loading={isLoading}
                    onChange={(newValue: Date | null) => {
                        setValue(newValue);
                    }}
                    onYearChange={handleChange}
                    onMonthChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                    renderLoading={() => <CalendarPickerSkeleton />}
                    renderDay={(day, _value, DayComponentProps) => {
                        const isSelected =
                            !DayComponentProps.outsideCurrentMonth &&
                            holidays?.find((currHoliday) => currHoliday === day.getDate());
                        return (
                            <Badge
                                key={day.toString()}
                                overlap="circular"
                                badgeContent={isSelected ? "🚫" : undefined}
                            >
                                <PickersDay {...DayComponentProps} />
                            </Badge>
                        );
                    }}
                />
            </LocalizationProvider>
            {selectedHoliday && selectedHoliday?.localName && (
                <HolidayCard
                    holiday={selectedHoliday}
                    localName={selectedHoliday.localName}
                    onClick={() => setValue(initialValue)}
                />
            )}
        </Fragment>
    );
};

export default Calendar;
