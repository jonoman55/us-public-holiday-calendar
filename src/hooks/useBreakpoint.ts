import { useTheme, useMediaQuery, Breakpoint } from "@mui/material";

export const useBreakpoint = (
    size: Breakpoint = 'sm',
    on: string = 'up'
) => {
    const theme = useTheme();
    const matches = useMediaQuery(
        on === 'down'
            ? theme.breakpoints.down(size)
            : theme.breakpoints.up(size), {
        noSsr: true
    });
    return matches;
};
