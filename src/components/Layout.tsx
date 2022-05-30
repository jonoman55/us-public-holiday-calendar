import { Fragment } from 'react';
import { Box } from '@mui/material';

import Header from './Header';

import type { ChildProps } from '../types';

const Layout = ({ children }: ChildProps) => (
    <Fragment>
        <Header />
        <Box component='main'>
            {children}
        </Box>
    </Fragment>
);

export default Layout;
