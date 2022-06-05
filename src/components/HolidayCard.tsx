import { useState, useMemo } from "react";
import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, Link, Typography } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { FaWikipediaW } from "react-icons/fa";

import { ExpandMoreButton } from "./ExpandMore";
import { HolidayAvatar } from "./HolidayAvatar";
import { createWikiUrl } from "../helpers";

import type { Holiday } from "../types";

interface HolidayCardProps {
    holiday: Holiday;
    localName: string;
    onClick: () => void;
};

const HolidayCard = ({ holiday, localName, onClick }: HolidayCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => setExpanded(!expanded);

    const wikiLink = useMemo(() => {
        if (localName)
            return createWikiUrl(localName);
    }, [localName]);

    return (
        <Card elevation={2}>
            <CardHeader
                title={localName}
                subheader={new Date(holiday.date).toLocaleDateString()}
                avatar={<Avatar><HolidayAvatar name={localName} /></Avatar>}
                action={<IconButton onClick={onClick}><Clear /></IconButton>} />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Holiday Description
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton component={Link} href={wikiLink} target="_blank">
                    <FaWikipediaW />
                </IconButton>
                <ExpandMoreButton
                    expanded={expanded}
                    onClick={handleExpandClick} />
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        More Info
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default HolidayCard;
