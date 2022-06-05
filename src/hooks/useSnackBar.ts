import { useCallback } from "react";
import { useSnackbar, VariantType } from "notistack";

// TODO : Convert alert props to type and expand options
export const useSnackBar = () => {
    const { enqueueSnackbar } = useSnackbar();

    const alert = useCallback((message: string, type: VariantType) => {
        enqueueSnackbar(message, {
            variant: type
        });
    }, [enqueueSnackbar]);

    return alert;
};