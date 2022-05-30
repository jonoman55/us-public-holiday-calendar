import { Box, Container } from '@mui/material';

import Calendar from '../components/Calendar';

const HomePage = () => (
    <Box sx={{ m: 1, p: 1 }}>
        <Container maxWidth='lg'>
            <Calendar />
        </Container>
    </Box>
);

export default HomePage;
