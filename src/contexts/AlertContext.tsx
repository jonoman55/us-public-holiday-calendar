import { createRef, useCallback } from 'react';
import { Slide, IconButton } from '@mui/material';
import { SnackbarProvider as NotistackProvider, SnackbarKey } from 'notistack';
import { Close as CloseIcon } from '@mui/icons-material';

import type { ChildProps } from '../types';

interface DismissProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const DismissIcon = ({ onClick }: DismissProps): JSX.Element => (
    <IconButton size='small' onClick={onClick}>
        <CloseIcon
            fontSize='small'
            sx={{ color: 'common.black' }}
        />
    </IconButton>
);

export const SnackbarProvider = ({ children }: ChildProps) => {
    const notistackRef = createRef<any>();

    const onClickDismiss = useCallback((key: SnackbarKey) => () => {
        notistackRef.current.closeSnackbar(key);
    }, [notistackRef]);

    return (
        <NotistackProvider
            ref={notistackRef}
            maxSnack={3}
            preventDuplicate
            autoHideDuration={3000}
            TransitionComponent={Slide}
            hideIconVariant={true}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            action={(key: SnackbarKey) => (
                <DismissIcon onClick={onClickDismiss(key)} />
            )}
        >
            {children}
        </NotistackProvider>
    );
};