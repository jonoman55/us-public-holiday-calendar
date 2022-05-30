import { useState, useEffect, useRef, useCallback } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Badge, TextField } from "@mui/material";

import { fetchPublicHolidays } from "../api/holidayApi";

import { PublicHoliday } from "../types";

const initialValue = new Date();

// TODO : Display holiday info when a holiday date is clicked
const Calendar = () => {
    const requestAbortController = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(initialValue);
    const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[] | undefined>([]);
    const [holidays, setHolidays] = useState<number[] | undefined>([]);

    const holidaysToHighlight = useCallback(async (date: Date) => {
        const controller = new AbortController();
        const res = await fetchPublicHolidays(date);
        if (res) setPublicHolidays(res.filter((d: PublicHoliday) => d !== undefined));
        if (publicHolidays) setHolidays(publicHolidays.map((d: PublicHoliday) => d.day));
        requestAbortController.current = controller;
    }, [publicHolidays]);

    useEffect(() => {
        holidaysToHighlight(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, [holidaysToHighlight]);

    const resetState = useCallback((date: Date) => {
        setIsLoading(true);
        setHolidays([]);
        setPublicHolidays([]);
        holidaysToHighlight(date);
        setIsLoading(false);
    }, [holidaysToHighlight]);

    const handleMonthChange = (date: Date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
            resetState(date);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
                value={value}
                loading={isLoading}
                onChange={(newValue: Date | null) => setValue(newValue)}
                onMonthChange={handleMonthChange}
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
    );
}

export default Calendar;
