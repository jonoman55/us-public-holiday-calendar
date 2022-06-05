import { createSlice } from '@reduxjs/toolkit';

import { getItem } from '../hooks';

const theme = getItem('theme') as string;

interface ThemeState {
    darkTheme: boolean;
}

const initialState: ThemeState = {
    darkTheme: Boolean(theme) ?? false
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkTheme = !state.darkTheme;
            localStorage.setItem(
                'theme',
                state.darkTheme.toString()
            );
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;