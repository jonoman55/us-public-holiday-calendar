import { createSlice, Slice } from '@reduxjs/toolkit';

/**
 * Theme Slice Name Type
 */
type Name = 'theme';

/**
 * Theme Slice Name
 */
const name: Name = 'theme';

/**
 * Toggle Theme Action Type
 */
type ThemeActions = {
    toggleTheme: (state: ThemeState) => void;
};

/**
 * Theme Slice Type
 */
type ThemeSlice = Slice<ThemeState, ThemeActions, Name>;

/**
 * Get System Preference Theme
 */
const getSystemPreference = (): boolean => {
    return window?.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
};

/**
 * Get Active Theme Mode
 */
const getActiveTheme = (): boolean => {
    const theme = JSON.parse(localStorage.getItem('theme') ?? '{}');
    if (typeof theme === 'object') {
        return getSystemPreference();
    }
    return Boolean(theme);
};

/**
 * Theme State
 */
type ThemeState = {
    /**
     * Dark Theme Mode State
     */
    darkTheme: boolean;
};

/**
 * Is Dark Theme
 */
const darkTheme: boolean = getActiveTheme();

/**
 * Initial Theme State
 */
const initialState: ThemeState = {
    darkTheme 
} as ThemeState;

/**
 * Theme Slice Reducers
 */
const reducers: ThemeActions = {
    /**
     * Toggle Theme Mode
     */
    toggleTheme: (state: ThemeState) => {
        state.darkTheme = !state.darkTheme;
        localStorage.setItem(
            'theme',
            state.darkTheme.toString()
        );
    },
};

/**
 * Theme Slice
 */
export const themeSlice: ThemeSlice = createSlice({
    name,
    initialState,
    reducers
});

const { actions, reducer } = themeSlice;
export const { toggleTheme } = actions;
export default reducer;