import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface ExpandMoreBtnProps {
    expanded: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ExpandMoreButton = ({ expanded, onClick }: ExpandMoreBtnProps) => (
    <ExpandMore
        expand={expanded}
        onClick={onClick}
        aria-expanded={expanded}
        aria-label="show more"
    >
        <ExpandMoreIcon />
    </ExpandMore>
);
