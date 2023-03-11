// TODO : Move createPublicHoliday & isPublicHoliday to helpers
// TODO : Hook up to calendarApi and holidaySlice
// TODO : Add styled TextField in Calendar
// TODO : Add custom ToolTip to buttons
// TODO : Hook up wiki api to populate card data for each holiday
// TODO : Find an image api for the holiday card
// DOCS : https://mui.com/x/react-date-pickers/date-picker/#ServerRequestDatePicker.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Badge, Paper, Stack, TextField } from "@mui/material";
import { alpha, darken, lighten } from "@mui/material/styles";
import moment from "moment";

import HolidayCard from "./HolidayCard";
import { fetchPublicHolidays } from "../apis/publicHolidayApi";

// import { holidayApi } from "../api/holidayApi";
// import { useAppDispatch } from "../app/hooks";

import type { CalendarHoliday, CalendarResponse, PublicHoliday, SelectedDay } from "../types";

/**
 * Initial Holiday Values
 */
const initialHolidayValues = {
    parsedDay: 0,
    name: "",
    description: "",
    country: {
        id: "",
        name: ""
    },
    date: {
        iso: "",
        datetime: {
            year: 0,
            month: 0,
            day: 0
        }
    },
    type: [],
    urlid: "",
    locations: "",
    states: ""
};

/**
 * Initial Date Value
 */
const initialValue: Date = new Date();

/**
 * Create Public Holiday
 * @param holiday Calendar Holiday 
 * @returns Public Holiday
 */
const createPublicHoliday = (holiday: CalendarHoliday): PublicHoliday => ({
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
});

/**
 * Check if date is a public holiday
 * @param date Current Date
 * @param holidayDate Target Holiday Date
 * @returns true or false
 */
const isPublicHoliday = (date: Date, holidayDate: Date) => {
    return date.getFullYear() === holidayDate.getFullYear() && date.getMonth() === holidayDate.getMonth()
};

/**
 * Calendar
 */
const Calendar = () => {
    const requestAbortController = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(initialValue);
    const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
    const [holidays, setHolidays] = useState<number[]>([]);
    const [selectedHoliday, setSelectedHoliday] = useState<PublicHoliday>(initialHolidayValues);

    const resetState = useCallback(() => {
        setValue(initialValue)
        setIsLoading(false);
        setHolidays([]);
        setPublicHolidays([]);
        setSelectedHoliday(initialHolidayValues);
    }, []);

    useEffect(
        () => resetState(),
        [resetState]
    );

    // render selected day
    const renderSelectedPickerDay = ({ day, pickersDayProps }: SelectedDay) => {
        const isSelected = !pickersDayProps.outsideCurrentMonth && holidays?.find(
            (currHoliday) => currHoliday === day.getDate()
        );
        return (
            <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={isSelected ? "🚫" : undefined}
            >
                <PickersDay {...pickersDayProps} />
            </Badge>
        );
    };

    const fetchSelectedDays = useCallback<(date: Date) => void>(
        (date: Date) => {
            const controller: AbortController = new AbortController();

            fetchPublicHolidays({
                date,
                signal: controller.signal
            })
                .then(({ data }: CalendarResponse) => {

                    // get holidays for current month
                    const publicHolidays: PublicHoliday[] = data?.response?.holidays?.map(
                        (holiday: CalendarHoliday) => isPublicHoliday(date, new Date(holiday.date.iso))
                            ? createPublicHoliday(holiday)
                            : undefined
                    ).filter(
                        (d: PublicHoliday | undefined) => d !== undefined
                    ) as PublicHoliday[];

                    // console.log('publicHolidays: ', publicHolidays);

                    // get holiday dates as numbers
                    const holidayDates: number[] = publicHolidays.map(
                        (holiday: PublicHoliday) => Number(holiday?.date?.datetime?.day)
                    );

                    // console.log('holidayDates: ', holidayDates);

                    // set state
                    setSelectedHoliday(initialHolidayValues);
                    setPublicHolidays(publicHolidays);
                    setHolidays(holidayDates);
                    setIsLoading(false);
                })
                .catch((error) => {
                    // ignore the error if it's caused by `controller.abort`
                    if (error.name !== 'AbortError') {
                        throw error;
                    }
                });

            requestAbortController.current = controller;
        },
        []
    );

    useEffect(() => {
        // fetch holidays from selected date range
        fetchSelectedDays(initialValue);
        // abort request on unmount
        return () => {
            requestAbortController.current?.abort();
        };
    }, [fetchSelectedDays]);

    // get selected holiday from calendar
    const handleSelectedHoliday = useCallback<(date: Date) => void>((date: Date) => {
        setSelectedHoliday(publicHolidays?.filter((holiday: PublicHoliday) =>
            holiday.date.iso === moment(date).format("YYYY-MM-DD") && holiday.type.find(
                (t) => t === 'National holiday'
            )
        ).shift() as PublicHoliday);
    }, [publicHolidays]);

    const handleCalendarChange = useCallback<(date: Date) => void>((date: Date) => {
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
    }, [fetchSelectedDays]);

    useEffect(() => {
        if (value) handleSelectedHoliday(value)
    }, [handleSelectedHoliday, value]);

    const handleChange = (newValue: Date | null) => {
        setValue(newValue);
        if (newValue) {
            handleSelectedHoliday(newValue);
        }
    };

    const handleOnClick = () => {
        setSelectedHoliday(initialHolidayValues);
    };

    const renderDay = (day: Date, selectedDays: Date[], pickersDayProps: PickersDayProps<Date>) => (
        renderSelectedPickerDay({
            day,
            selectedDays,
            pickersDayProps
        })
    );

    // console.log('selectedHoliday: ', selectedHoliday);
    // console.log('value: ', value);

    return (
        <Stack direction='column' spacing={2}>
            <Paper elevation={2} sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.mode === 'dark'
                    ? lighten(
                        theme.palette.primary.dark,
                        theme.palette.action.disabledOpacity
                    )
                    : alpha(
                        theme.palette.primary.main,
                        theme.palette.action.hoverOpacity
                    ),
                '& .MuiPickerStaticWrapper-root': {
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.mode === 'dark'
                        ? lighten(
                            theme.palette.primary.dark,
                            theme.palette.action.disabledOpacity
                        )
                        : alpha(
                            theme.palette.primary.main,
                            theme.palette.action.hoverOpacity
                        ),
                },
            })}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                        showToolbar
                        value={value}
                        loading={isLoading}
                        onChange={handleChange}
                        onYearChange={handleCalendarChange}
                        onMonthChange={handleCalendarChange}
                        renderInput={(params) => <TextField {...params} />}
                        renderLoading={() => <CalendarPickerSkeleton />}
                        renderDay={renderDay}
                    />
                </LocalizationProvider>
            </Paper>
            {selectedHoliday && selectedHoliday.name !== '' && (
                <HolidayCard
                    holiday={selectedHoliday}
                    onClick={handleOnClick}
                />
            )}
        </Stack>
    );
};

export default Calendar;
