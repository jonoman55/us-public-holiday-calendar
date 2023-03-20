// TODO : Fix isSelected to populate calendar holidays
// TODO : Add styled TextField in Calendar
// TODO : Add custom ToolTip to buttons
// TODO : Hook up wiki api to populate card data for each holiday
// TODO : Find an image api for the holiday card
// DOCS : https://mui.com/x/react-date-pickers/date-picker/#ServerRequestDatePicker.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo, useCallback } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Badge, Paper, Stack, TextField } from "@mui/material";
import { alpha, lighten } from "@mui/material/styles";
import moment from "moment";

import HolidayCard from "./HolidayCard";
import { holidayActions, isPublicHolidayType } from "../reducers/holidaySlice";
import { holidayApi, useGetHolidaysQuery } from "../apis/holidayApi";
import { calendarApi, useGetPublicHolidaysQuery } from "../apis/calendarApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createQueryParams } from "../helpers";

import type { PublicHoliday, SelectedDay, QueryParams, Holiday } from "../types";

/**
 * Initial Date Value
 */
// const initialValue: Date = new Date();

/**
 * Calendar
 */
const Calendar = () => {
    const dispatch = useAppDispatch();

    const {
        isLoading,
        currentDate,
        holidays,
        publicHolidays,
        selectedHoliday
    } = useAppSelector((state) => state.holidays);

    // console.log('holidays: ', holidays);
    // console.log('publicHolidays: ', publicHolidays);

    /** query params for api call */
    const queryParams = useMemo<QueryParams>(
        () => createQueryParams({
            date: currentDate,
            country: "US"
        }),
        [currentDate]
    );

    const fetchPublicHolidays = useCallback<() => void>(() => {
        dispatch(holidayActions.setIsLoading(true));
        dispatch(calendarApi.endpoints.getPublicHolidays.initiate(queryParams)).then(
            (response) => {
                if (!response.isLoading && response.isSuccess) {
                    if (response?.data) dispatch(holidayActions.setPublicHolidays(response.data));
                }
            }
        ).catch((error) => {
            console.error(error);
        }).finally(() => {
            dispatch(holidayActions.setIsLoading(false));
        });
    }, [dispatch, queryParams]);

    const fetchHolidays = useCallback<() => void>(() => {
        dispatch(holidayActions.setIsLoading(true));
        dispatch(holidayApi.endpoints.getHolidays.initiate(queryParams)).then(
            (response) => {
                if (!response.isLoading && response.isSuccess) {
                    if (response?.data) dispatch(holidayActions.setHolidays(response.data));
                }
            }
        ).catch((error) => {
            console.error(error);
        }).finally(() => {
            dispatch(holidayActions.setIsLoading(false));
        });
    }, [dispatch, queryParams]);

    /** Fetch holidays for date range */
    const handleSelectedHoliday = useCallback<(date: Date) => void>((date: Date) => {
        if (publicHolidays) {
            const publicHoliday: PublicHoliday = publicHolidays?.filter(
                (holiday: PublicHoliday) =>
                    holiday.date.iso === moment(date).format("YYYY-MM-DD") &&
                    holiday.type.find(
                        (t: string) => t === 'National holiday'
                    )
            ).shift() as PublicHoliday;
            dispatch(holidayActions.setSelectedHoliday(publicHoliday));
        }
        if (holidays) {
            const holiday: Holiday = holidays?.filter(
                (holiday: Holiday) =>
                    holiday.date === moment(date).format("YYYY-MM-DD") &&
                    holiday?.type?.toLowerCase().includes('public')
            ).shift() as Holiday;
            dispatch(holidayActions.setSelectedHoliday(holiday));
        }
    }, [dispatch, publicHolidays, holidays]);

    const handleCalendarChange = useCallback<() => void>(() => {
        fetchPublicHolidays();
        fetchHolidays();
    }, [fetchPublicHolidays, fetchHolidays]);

    /** Set holiday date */
    const handleChange = (newValue: Date | null) => {
        if (newValue) {
            dispatch(holidayActions.setCurrentDate(newValue));
            handleSelectedHoliday(newValue);
        }
    };

    /** Clear Selected Holiday */
    const handleClick = () => {
        dispatch(holidayActions.setSelectedHoliday(null));
    };

    const handleIsSelected = useCallback<({ day, pickersDayProps }: SelectedDay) => false | Holiday | PublicHoliday | undefined>(
        ({ day, pickersDayProps }: SelectedDay) => {
            if (publicHolidays) {
                return !pickersDayProps.outsideCurrentMonth && publicHolidays?.find(
                    (currHoliday: PublicHoliday) => currHoliday.date.iso === moment(day).format("YYYY-MM-DD")
                );
            }
            if (holidays) {
                return !pickersDayProps.outsideCurrentMonth && holidays?.find(
                    (currHoliday: Holiday) => moment(currHoliday.date).format("YYYY-MM-DD") === moment(day).format("YYYY-MM-DD")
                );
            }
        },
        [publicHolidays, holidays]
    );

    /** Render Selected DatePicker Day */
    const renderSelectedPickerDay = ({ day, selectedDays, pickersDayProps }: SelectedDay) => {
        const isSelected = handleIsSelected({
            day,
            selectedDays,
            pickersDayProps
        });
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

    /** Render Selected Calendar Day */
    const renderDay = (day: Date, selectedDays: Date[], pickersDayProps: PickersDayProps<Date>) => (
        renderSelectedPickerDay({
            day,
            selectedDays,
            pickersDayProps
        })
    );

    // console.log('selectedHoliday: ', selectedHoliday);

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
                        value={currentDate}
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
                    onClick={handleClick}
                />
            )}
        </Stack>
    );
};

export default Calendar;
