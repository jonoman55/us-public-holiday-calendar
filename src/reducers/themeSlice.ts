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
    /**
     * Toggle Theme Action
     */
    toggleTheme: (state: ThemeState) => void;
};

/**
 * Theme Slice Type
 */
type ThemeSlice = Slice<ThemeState, ThemeActions, Name>;

/**
 * Get System Preference Theme
 * @returns true or false
 */
const getSystemPreference = (): boolean => {
    return window?.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
};

/**
 * Get Active Theme Mode 
 * 
 * Gets the theme from the browsers localStorage or system preferences
 * @returns true or false
 */
const getActiveTheme = (): boolean => {
    const theme = JSON.parse(localStorage.getItem(name) ?? '{}');
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
 * Dark Theme (Theme Mode)
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
            name,
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

/**
 * Theme Slice Reducer and Actions 
 */
const { reducer, actions } = themeSlice;
/**
 * Theme Actions
 */
export const { toggleTheme } = actions;
/**
 * Theme Reducer
 */
export default reducer;
