import { Switch } from "@mui/material";
import { styled, alpha, lighten } from "@mui/material/styles";;

/**
 * Styled Custom Switch
 */
const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-thumb': {
        color: theme.custom.palette.orange,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        '&:hover': {
            backgroundColor: alpha(
                theme.palette.action.disabled,
                theme.palette.action.hoverOpacity
            ),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: lighten(
            theme.palette.action.disabled,
            theme.palette.action.focusOpacity
        ),
    },
}));

/**
 * Theme Switch Props
 */
interface ThemeSwitchProps {
    checked: boolean;
    onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void);
};

/**
 * Theme Switch
 */
const ThemeSwitch = ({ checked, onChange }: ThemeSwitchProps) => (
    <CustomSwitch
        checked={checked}
        onChange={onChange}
    />
);

export default ThemeSwitch;
