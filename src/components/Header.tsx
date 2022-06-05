import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import ThemeSwitch from "./ThemeSwitch";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTheme } from "../reducers/themeSlice";
import calendar from "../images/calendar.png";

// TODO : Convert Toolbar to styled component
// TODO : Add FlexText to shrink the text size depending on screen size
// TODO : Convert Calendar Icon to refresh page IconButton
const Header = () => {
    const dispatch = useAppDispatch();
    const { darkTheme } = useAppSelector((state) => state.theme);
    return (
        <AppBar position="static" elevation={2}>
            <Toolbar component="div" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                    component="img"
                    src={calendar}
                    alt="calendar"
                    height={24}
                />
                <Typography component="h3" variant="h4">
                    US Public Holiday Calendar
                </Typography>
                <ThemeSwitch
                    checked={darkTheme}
                    onChange={() => dispatch(toggleTheme())}
                />
            </Toolbar>
        </AppBar>
    );
}

export default Header;
