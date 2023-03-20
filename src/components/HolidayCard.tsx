// TODO : Fix description formatting

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo, useState, useEffect } from "react";
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Link, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { alpha, lighten } from "@mui/material/styles";
import { FaWikipediaW } from "react-icons/fa";

import { HolidayAvatar } from "./HolidayAvatar";
import { isPublicHolidayType } from "../reducers/holidaySlice";
import { createSearchResult, fetchWikiData, SearchResult, wikiApi, type WikiQueryResponse } from "../apis/wikiApi";
import { useAppDispatch } from "../app/hooks";
import { createWikiUrl, removeHtmlTags, removeSpecialCharacters, sanitizeName } from "../helpers";

import type { PublicHoliday, Holiday } from "../types";

/**
 * Holiday Card Props
 */
interface HolidayCardProps {
    holiday: PublicHoliday | Holiday;
    onClick: () => void;
};

/**
 * Holiday Card
 */
const HolidayCard = ({ holiday, onClick }: HolidayCardProps) => {
    const dispatch = useAppDispatch();

    const [description, setDescription] = useState<string>('');

    const holidayName = useMemo<string>(
        () => {
            let result: string = '';
            if (isPublicHolidayType(holiday)) {
                result = sanitizeName(holiday?.name as string);
            } else {
                result = holiday?.localName as string;
            }
            return result;
        },
        [holiday]
    );

    const holidayDate = useMemo<string>(
        () => {
            if (isPublicHolidayType(holiday)) {
                return new Date(holiday?.date?.iso).toLocaleDateString('en-US', {
                    timeZone: 'UTC'
                });
            } else {
                return new Date(holiday?.date).toLocaleDateString('en-US', {
                    timeZone: 'UTC'
                });
            }
        },
        [holiday]
    );

    const wikiLink = useMemo<string>(
        () => createWikiUrl(holidayName),
        [holidayName]
    );

    // const fetchDescription = (holiday: Holiday) => {
    //     fetchWikiData(holiday?.localName as string).then((res) => {
    //         const results: SearchResult[] = res.query.search.map(
    //             (qr: SearchResult) => createSearchResult(qr)
    //         );
    //         const foundResult = results.filter(
    //             (sr: SearchResult) => holiday.localName?.includes(removeSpecialCharacters(sr.title))
    //         ).shift() as SearchResult;
    //         if (foundResult) {
    //             setDescription(removeHtmlTags(foundResult.snippet));
    //         }
    //     });
    // };

    const handleDescription = useCallback<() => void>(() => {
        if (isPublicHolidayType(holiday)) {
            setDescription(holiday.description);
        } else {
            fetchWikiData(holiday?.localName as string).then((res) => {
                const results: SearchResult[] = res.query.search.map(
                    (qr: SearchResult) => createSearchResult(qr)
                );
                const foundResult = results.filter(
                    (sr: SearchResult) => holiday.localName?.includes(removeSpecialCharacters(sr.title))
                ).shift() as SearchResult;
                if (foundResult) {
                    setDescription(removeHtmlTags(foundResult.snippet));
                }
            });
            // dispatch(wikiApi.endpoints.getHolidayData.initiate(holiday?.localName)).then((response) => {
            //     if (!response.isLoading && response.isSuccess) {
            //         console.log(response.data.find(
            //             (queryResult) => holiday?.localName?.includes(queryResult.title)
            //         ));
            //     }
            // });
        }
    }, [holiday]);

    useEffect(
        () => handleDescription(),
        [handleDescription]
    );

    return (
        <Card elevation={2} sx={(theme) => ({
            margin: theme.spacing(1),
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
        })}>
            <CardHeader
                title={holidayName}
                subheader={holidayDate}
                avatar={
                    <Avatar>
                        <HolidayAvatar name={holidayName} />
                    </Avatar>
                }
                action={
                    <IconButton onClick={onClick} sx={{ color: 'primary.contrastText' }}>
                        <Clear />
                    </IconButton>
                }
            />
            <CardContent>
                {description && (
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </CardContent>
            <CardActions disableSpacing>
                <IconButton component={Link} href={wikiLink} target="_blank" sx={{ color: 'primary.contrastText' }}>
                    <FaWikipediaW />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default HolidayCard;
