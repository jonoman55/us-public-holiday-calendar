import React from 'react';
import { Box } from '@mui/material';

import Header from './Header';

import type { ChildProps } from '../types';

const Layout = ({ children }: ChildProps) => (
    <React.Fragment>
        <Header />
        <Box component='main'>
            {children}
        </Box>
    </React.Fragment>
);

export default Layout;
