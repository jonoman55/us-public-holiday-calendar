// TODO : Convert useGetPublicHolidaysQuery into a useCallback function to accept year changes
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
import { holidayActions } from "../reducers/holidaySlice";
import { useGetPublicHolidaysQuery } from "../apis/calendarApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createQueryParams } from "../helpers";

import type { PublicHoliday, SelectedDay, QueryParams } from "../types";

/**
 * Initial Date Value
 */
const initialValue: Date = new Date();

/**
 * Calendar
 */
const Calendar = () => {
    const dispatch = useAppDispatch();

    const [dateValue, setDateValue] = useState<Date>(initialValue);

    const { holidays, selectedHoliday } = useAppSelector((state) => state.holidays);

    const queryParams = useMemo<QueryParams>(
        () => createQueryParams({
            date: dateValue,
            country: "US"
        }),
        [dateValue]
    );

    const {
        data: holidaysResults,
        isLoading: holidaysIsLoading,
        refetch: holidaysRefetch
    } = useGetPublicHolidaysQuery(queryParams, {
        // refetchOnMountOrArgChange: true,
        // refetchOnReconnect: true,
        // refetchOnFocus: true,
    });

    const isLoading = useMemo<boolean>(
        () => holidaysIsLoading,
        [holidaysIsLoading]
    );

    const publicHolidays = useMemo<PublicHoliday[]>(() => {
        const results: PublicHoliday[] = [];
        if (!isLoading && holidaysResults) {
            holidaysResults.map(
                (ph: PublicHoliday) => results.push(ph)
            );
        }
        return results;
    }, [isLoading, holidaysResults]);

    const handleSetPubicHolidays = useCallback(() => {
        if (!holidays?.length) {
            dispatch(holidayActions.setHolidays(publicHolidays));
        }
    }, [dispatch, holidays, publicHolidays]);

    useEffect(
        () => handleSetPubicHolidays(),
        [handleSetPubicHolidays]
    );

    const refetchData = useCallback<() => void>(() => {
        holidaysRefetch();
    }, [holidaysRefetch]);

    const resetState = useCallback<() => void>(() => {
        setDateValue(initialValue);
        dispatch(holidayActions.setHolidays(null));
        dispatch(holidayActions.setSelectedHoliday(null));
        refetchData();
    }, [dispatch, refetchData]);

    /** fetch holidays for date range */
    const handleSelectedHoliday = useCallback(() => {
        if (dateValue) {
            dispatch(holidayActions.setSelectedHoliday(
                publicHolidays?.filter(
                    (holiday: PublicHoliday) =>
                        holiday.date.iso === moment(dateValue).format("YYYY-MM-DD") &&
                        holiday.type.find((t) => t === 'National holiday')
                ).shift() as PublicHoliday)
            );
        }
    }, [dispatch, publicHolidays, dateValue]);

    useEffect(
        () => handleSelectedHoliday(),
        [handleSelectedHoliday]
    );

    const handleCalendarChange = useCallback<() => void>(() => {
        refetchData();
    }, [refetchData]);

    /** set holiday date */
    const handleChange = (newValue: Date | null) => {
        if (newValue) {
            setDateValue(newValue);
        }
    };

    /** clear selected holiday */
    const handleClick = () => resetState();

    /** Render Selected DatePicker Day */
    const renderSelectedPickerDay = ({ day, pickersDayProps }: SelectedDay) => {
        const isSelected = !pickersDayProps.outsideCurrentMonth && holidays?.find(
            (currHoliday: PublicHoliday) => currHoliday.date.iso === moment(day).format("YYYY-MM-DD")
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

    /** Render Selected Calendar Day */
    const renderDay = (day: Date, selectedDays: Date[], pickersDayProps: PickersDayProps<Date>) => (
        renderSelectedPickerDay({
            day,
            selectedDays,
            pickersDayProps
        })
    );

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
                        value={dateValue}
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
