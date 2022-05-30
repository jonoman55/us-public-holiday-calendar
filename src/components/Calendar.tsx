/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import { LocalizationProvider, CalendarPickerSkeleton, StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, Link, TextField, Typography } from "@mui/material";
import { FaWikipediaW } from "react-icons/fa";
import { Favorite, Share } from "@mui/icons-material";
import moment from "moment";

import { ExpandMoreButton } from "./ExpandMore";
import { HolidayAvatar } from "./HolidayAvatar";
import { fetchHolidays } from "../apis/publicHolidayApi";
import { createWikiUrl } from "../helpers";

// import { holidayApi } from "../api/holidayApi";
// import { useAppDispatch } from "../app/hooks";

import { Holiday, HolidayResponse } from "../types";

const initialValue = new Date();

// TODO : Add custom ToolTip to buttons
// TODO : Move the selected holiday card to new file
// TODO : Move the wiki action icon to card actions and replace with clear button
// TODO : Hook up wiki api to populate card data for each holiday
// TODO : Find an image api for the holiday card
// DOCS : https://mui.com/x/react-date-pickers/date-picker/#ServerRequestDatePicker.tsx
const Calendar = () => {
    const requestAbortController = useRef<AbortController | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<Date | null>(initialValue);
    const [publicHolidays, setPublicHolidays] = useState<Holiday[] | undefined>([]);
    const [holidays, setHolidays] = useState<number[] | undefined>([]);

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const fetchHighlightedDays = (date: Date) => {
        const controller = new AbortController();
        fetchHolidays(date, {
            signal: controller.signal,
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
        return publicHolidays?.filter((holiday) =>
            holiday.date === moment(value).format("YYYY-MM-DD")
            && holiday.type === "Public"
        ).shift() as Holiday;
    }, [publicHolidays, value]);

    const wikiLink = useMemo(() => {
        if (selectedHoliday?.localName)
            return createWikiUrl(selectedHoliday?.localName);
    }, [selectedHoliday]);

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
            {selectedHoliday?.localName && (
                <Card elevation={2}>
                    <CardHeader
                        title={selectedHoliday.localName}
                        subheader={new Date(selectedHoliday.date).toLocaleDateString()}
                        avatar={<Avatar><HolidayAvatar name={selectedHoliday.localName} /></Avatar>}
                        action={<IconButton component={Link} href={wikiLink} target="_blank"><FaWikipediaW /></IconButton>}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Holiday Description
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <Favorite />
                        </IconButton>
                        <IconButton aria-label="share">
                            <Share />
                        </IconButton>
                        <ExpandMoreButton
                            expanded={expanded}
                            onClick={handleExpandClick}
                        />
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                More Info
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            )}
        </Fragment>
    );
}

export default Calendar;
