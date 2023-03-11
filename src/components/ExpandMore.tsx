import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Expand More Props
 */
interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
};

/**
 * Style Expand More
 */
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

/**
 * Expand More Button Props
 */
interface ExpandMoreButtonProps {
    expanded: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

/**
 * Expand More Button
 */
export const ExpandMoreButton = ({ expanded, onClick }: ExpandMoreButtonProps) => (
    <ExpandMore
        expand={expanded}
        onClick={onClick}
        aria-expanded={expanded}
        aria-label="show more"
    >
        <ExpandMoreIcon />
    </ExpandMore>
);
