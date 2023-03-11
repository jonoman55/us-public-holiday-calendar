import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import ThemeSwitch from "./ThemeSwitch";
import { toggleTheme } from "../reducers/themeSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import calendar from "../images/calendar.png";

// TODO : Convert Toolbar to styled component
// TODO : Add FlexText to shrink the text size depending on screen size
// TODO : Convert Calendar Icon to refresh page IconButton

/**
 * Header
 */
const Header = () => {
    const dispatch = useAppDispatch();
    const darkTheme: boolean = useAppSelector(
        (state) => state.theme.darkTheme
    );
    return (
        <AppBar component="header" position="static" elevation={2} sx={(theme) => ({
            padding: theme.spacing(1, 0),
            marginBottom: theme.spacing(2),
            borderBottomRightRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
        })}>
            <Toolbar component="div" sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box
                    component="img"
                    src={calendar}
                    alt="calendar"
                    height={24}
                />
                <Typography component="h4" variant="h4">
                    US Public Holiday Calendar
                </Typography>
                <ThemeSwitch
                    checked={darkTheme}
                    onChange={() => dispatch(toggleTheme())}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
