import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import { SnackbarProvider } from './contexts/AlertContext';
import { ErrorFallback, LoadingContainer } from './components/LazyLoad';
import { useAppSelector } from './app/hooks';
import { lightTheme, darkTheme } from './theme';

const Routes = lazy(() => import('./routes'));

const App = () => {
    const theme = useAppSelector((state) => state.theme);
    const activeTheme = createTheme(theme.darkTheme ? darkTheme : lightTheme);
    return (
        <ThemeProvider theme={activeTheme}>
            <SnackbarProvider>
                <CssBaseline />
                <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
                    <Suspense fallback={<LoadingContainer />}>
                        <Routes />
                    </Suspense>
                </ErrorBoundary>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
