/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Badge, Paper, Stack, TextField } from "@mui/material";
import moment from "moment";

import HolidayCard from "./HolidayCard";
import { fetchPublicHolidays } from "../apis/publicHolidayApi";

// import { holidayApi } from "../api/holidayApi";
// import { useAppDispatch } from "../app/hooks";

import type { CalendarHoliday, CalendarResponse, PublicHoliday, SelectedDay } from "../types";

const initialValue = new Date();

// TODO : Add useSnackbar
// TODO : Style the Calendar
// TODO : Add styled TextField in Calendar
// TODO : Remove duplicate holidays (substitutes)
// TODO : Move selectedHoliday to useState to make it clearable
// TODO : Add custom ToolTip to buttons
// TODO : Hook up wiki api to populate card data for each holiday
// TODO : Find an image api for the holiday card
// DOCS : https://mui.com/x/react-date-pickers/date-picker/#ServerRequestDatePicker.tsx
const Calendar = () => {
    const requestAbortController = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(initialValue);
    const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
    const [holidays, setHolidays] = useState<number[]>([]);

    // render selected day
    const renderSelectedPickerDay = ({ date, selectedDates, pickersDayProps }: SelectedDay) => {
        const isSelected =
            !pickersDayProps.outsideCurrentMonth &&
            holidays?.find((currHoliday) => currHoliday === date.getDate());
        return (
            <Badge
                key={date.toString()}
                overlap="circular"
                badgeContent={isSelected ? "🚫" : undefined}
            >
                <PickersDay {...pickersDayProps} />
            </Badge>
        );
    };

    const fetchSelectedDays = (date: Date) => {
        const controller = new AbortController();
        fetchPublicHolidays({
            date,
            signal: controller.signal
        })
            .then(({ data }: CalendarResponse) => {
                // get holidays for current month
                const holidays = data.response.holidays;
                const calendarRes = holidays.map((holiday: CalendarHoliday) => {
                    const holidayDate = new Date(holiday.date.iso);
                    if (date.getFullYear() === holidayDate.getFullYear() && date.getMonth() === holidayDate.getMonth()) {
                        return {
                            name: holiday.name,
                            description: holiday.description,
                            country: {
                                id: holiday.country.id,
                                name: holiday.country.name,
                            },
                            date: {
                                iso: holiday.date.iso,
                                datetime: {
                                    year: holiday.date.datetime.year,
                                    month: holiday.date.datetime.month,
                                    day: holiday.date.datetime.day
                                }
                            },
                            type: holiday.type,
                            urlid: holiday.urlid,
                            locations: holiday.locations,
                            states: holiday.states,
                            parsedDay: holiday.date.datetime.day
                        } as PublicHoliday;
                    } else return undefined;
                }).filter((d: PublicHoliday | undefined) => d !== undefined);
                // set state
                setPublicHolidays(calendarRes as PublicHoliday[]);
                setHolidays(calendarRes.map((holiday) => holiday?.date?.datetime.day as number));
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
        // fetchHighlightedDays(initialValue);
        fetchSelectedDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleChange = useCallback((date: Date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current?.abort();
            // refresh state
            setIsLoading(true);
            setHolidays([]);
            setPublicHolidays([]);
            fetchSelectedDays(date);
        }
    }, []);

    // get selected holiday from calendar
    const selectedHoliday = useMemo(() => {
        return publicHolidays?.filter((holiday: PublicHoliday) =>
            holiday.date.iso === moment(value).format("YYYY-MM-DD")
            && holiday.type.find((t) => t === 'National holiday')
        ).shift();
    }, [publicHolidays, value]);

    // console.log(selectedHoliday);

    return (
        <Stack direction='column' spacing={2}>
            <Paper elevation={2} sx={{ bgcolor: 'primary.main' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                        showToolbar
                        value={value}
                        loading={isLoading}
                        onChange={(newValue: Date | null) => {
                            setValue(newValue);
                        }}
                        onYearChange={handleChange}
                        onMonthChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                        renderLoading={() => <CalendarPickerSkeleton />}
                        renderDay={(day, _value, DayComponentProps) => 
                            renderSelectedPickerDay({
                                date: day,
                                selectedDates: _value,
                                pickersDayProps: DayComponentProps
                            })
                        }
                    />
                </LocalizationProvider>
            </Paper>
            {selectedHoliday && (
                <HolidayCard
                    holiday={selectedHoliday}
                    onClick={() => setValue(initialValue)}
                />
            )}
        </Stack>
    );
};

export default Calendar;
