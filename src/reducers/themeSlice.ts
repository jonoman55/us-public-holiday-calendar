import { createSlice } from '@reduxjs/toolkit';

import { getItem } from '../hooks/useStorage';

const theme = getItem('theme');

const initialState = {
    darkTheme: Boolean(theme) ? theme : true
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkTheme = !state.darkTheme;
            localStorage.setItem(
                'theme',
                state.darkTheme
            );
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;