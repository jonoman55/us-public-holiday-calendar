import { Switch } from "@mui/material";
import { styled, alpha, lighten } from "@mui/material/styles";;

const OrangeSwitch = styled(Switch)(({ theme }) => ({
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

interface SwitchProps {
    checked: boolean;
    onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined;
}

const ThemeSwitch = ({ checked, onChange }: SwitchProps) => (
    <OrangeSwitch
        checked={checked}
        onChange={onChange}
    />
);

export default ThemeSwitch;
