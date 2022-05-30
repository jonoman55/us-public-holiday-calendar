import { useTheme } from "@mui/material/styles";
import { NoAccounts, Work, MilitaryTech } from "@mui/icons-material";
import { GiAfrica, GiTombstone, GiPartyPopper, GiFist, GiFireworkRocket, GiShoonerSailboat, GiChickenOven, GiPresent } from "react-icons/gi";
import { FaFlagUsa, FaCross } from "react-icons/fa";

export const HolidayAvatar = ({ name }: { name: string; }): JSX.Element => {
    const theme = useTheme();
    const style = { color: theme.palette.primary.contrastText };
    switch (name) {
        case "New Year's Day":
            return <GiPartyPopper style={style} />;
        case "Martin Luther King, Jr. Day":
            return <GiFist style={style} />;
        case "Presidents Day":
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
    }
};
