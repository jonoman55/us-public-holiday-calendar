/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from "react";
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Link, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { alpha, darken, lighten } from "@mui/material/styles";
import { FaWikipediaW } from "react-icons/fa";

import { HolidayAvatar } from "./HolidayAvatar";
import { createWikiUrl } from "../helpers";

import type { PublicHoliday } from "../types";

/**
 * Holiday Card Props
 */
interface HolidayCardProps {
    holiday: PublicHoliday;
    onClick: () => void;
};

/**
 * Sanitized Holiday Name
 * @param name Holiday Name
 * @returns Sanitized Holiday Name String
 */
const sanitizeName = (name: string): string => {
    if (name.includes('(')) {
        return name.replace('(substitute)', '').trim();
    }
    return name;
};

/**
 * Holiday Card
 */
const HolidayCard = ({ holiday, onClick }: HolidayCardProps) => {
    const holidayName = useMemo<string>(
        () => sanitizeName(holiday.name),
        [holiday]
    );
    const holidayDate = useMemo<string>(
        () => new Date(holiday.date.iso).toLocaleDateString('en-US', {
            timeZone: 'UTC'
        }),
        [holiday]
    );
    const wikiLink = useMemo<string>(
        () => createWikiUrl(holidayName),
        [holidayName]
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
                <Typography variant="body2" color="text.secondary">
                    {holiday.description}
                </Typography>
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
