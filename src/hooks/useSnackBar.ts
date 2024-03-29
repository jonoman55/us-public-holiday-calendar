import { useCallback } from "react";
import { useSnackbar, OptionsObject, ProviderContext, SnackbarKey, SnackbarMessage } from "notistack";

/**
 * Use Notify Props
 */
interface NotifyProps extends OptionsObject {
    message: SnackbarMessage;
};

/**
 * Use Notify Hook
 */
export const useNotify = () => {
    const { enqueueSnackbar } = useSnackbar() as ProviderContext;
    return useCallback<({ key, message, variant, ...rest }: NotifyProps) => void>(
        ({ key, message, variant, ...rest }: NotifyProps) => {
            enqueueSnackbar(message, {
                key,
                variant,
                ...rest
            });
        },
        [enqueueSnackbar]
    );
};

/**
 * Use Close Notify Hook
 */
export const useCloseNotify = () => {
    const { closeSnackbar } = useSnackbar() as ProviderContext;
    return useCallback<(key: SnackbarKey) => void>(
        (key: SnackbarKey) => {
            if (key) closeSnackbar(key);
        },
        [closeSnackbar]
    );
};
