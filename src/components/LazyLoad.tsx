import { styled, Box, Button, CircularProgress, Typography } from '@mui/material';

const ErrorContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper
}));

interface ErrorProps {
    error: { message: string };
    resetErrorBoundary: () => void;
};

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorProps) => (
    <ErrorContainer component='div' role='alert'>
        <Typography component='p' variant='body1' fontSize='large' gutterBottom>Something went wrong:</Typography>
        <Typography component='pre' color='error' sx={{ p: 2, whiteSpace: 'pre-line' }}>{error.message}</Typography>
        <Button variant='contained' color='primary' onClick={resetErrorBoundary}>Try Again</Button>
    </ErrorContainer>
);

const Container = styled(Box)(({ theme }) => ({
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
}));

const Text = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText,
}));

const Loader = styled(CircularProgress)(({ theme }) => ({
    color: theme.custom.palette.orange,
}));

export const LoadingContainer = () => (
    <Container component='main'>
        <Loader />
        <Text variant='h5'>
            Loading...
        </Text>
    </Container>
);
