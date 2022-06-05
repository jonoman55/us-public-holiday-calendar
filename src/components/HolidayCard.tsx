import { useMemo } from "react";
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Link, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { FaWikipediaW } from "react-icons/fa";

import { HolidayAvatar } from "./HolidayAvatar";
import { createWikiUrl } from "../helpers";

import type { PublicHoliday } from "../types";

interface HolidayCardProps {
    holiday: PublicHoliday;
    onClick: () => void;
};

const sanitizeName = (name: string) => {
    if (name.includes('(')) {
        return name.replace('(substitute)', '').trim();
    }
    return name;
};

const HolidayCard = ({ holiday, onClick }: HolidayCardProps) => {
    const holidayName: string = useMemo(() => sanitizeName(holiday.name), [holiday]);

    const wikiLink: string = useMemo(() => createWikiUrl(holidayName), [holidayName]);

    return (
        <Card elevation={2} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main' }}>
            <CardHeader
                title={holidayName}
                subheader={new Date(holiday.date.iso).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                avatar={<Avatar><HolidayAvatar name={holidayName} /></Avatar>}
                action={<IconButton onClick={onClick}><Clear sx={{ color: 'primary.contrastText' }} /></IconButton>} />
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
