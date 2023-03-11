import { useTheme, Theme } from "@mui/material/styles";
import { NoAccounts, Work, MilitaryTech } from "@mui/icons-material";
import { GiAfrica, GiTombstone, GiPartyPopper, GiFist, GiFireworkRocket, GiShoonerSailboat, GiChickenOven, GiPresent } from "react-icons/gi";
import { FaFlagUsa, FaCross } from "react-icons/fa";

/**
 * Create Avatar Icon Color
 * @param theme MUI Theme
 * @returns CSS Color
 */
const createIconColor = (theme: Theme): React.CSSProperties => ({
    color: theme.palette.primary.contrastText
});

/**
 * Holiday Avatar
 * @param name Holiday Name
 */
export const HolidayAvatar = ({ name }: { name: string; }) => {
    const theme: Theme = useTheme();
    const style: React.CSSProperties = createIconColor(theme);
    switch (name) {
        case "New Year's Day":
            return <GiPartyPopper style={style} />;
        case "Martin Luther King Jr. Day":
            return <GiFist style={style} />;
        case "Presidents' Day":
            return <FaFlagUsa style={style} />;
        case "Good Friday":
            return <FaCross style={style} />;
        case "Memorial Day":
            return <GiTombstone style={style} />;
        case "Juneteenth":
            return <GiAfrica style={style} />;
        case "Independence Day":
            return <GiFireworkRocket style={style} />;
        case "Labor Day":
            return <Work sx={style} />;
        case "Columbus Day":
            return <GiShoonerSailboat style={style} />;
        case "Veterans Day":
            return <MilitaryTech sx={style} />;
        case "Thanksgiving Day":
            return <GiChickenOven style={style} />;
        case "Christmas Day":
            return <GiPresent style={style} />;
        default:
            return <NoAccounts sx={style} />;
    };
};
