import { ThemeOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      palette: {
        orange: string,
      }
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      palette?: {
        orange?: string,
      }
    };
  }
}

const scrollBodyLight = {
  scrollbarColor: '#959595 #2b2b2b',
  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
    backgroundColor: '#2b2b2b',
  },
  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
    borderRadius: 8,
    backgroundColor: '#959595',
    minHeight: 24,
    border: '3px solid #2b2b2b',
  },
  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
    backgroundColor: '#6b6b6b',
  },
  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
    backgroundColor: '#6b6b6b',
  },
  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#6b6b6b',
  },
  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
    backgroundColor: '#2b2b2b',
  },
};

const scrollBodyDark = {
  scrollbarColor: '#6b6b6b #2b2b2b',
  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
    backgroundColor: '#2b2b2b',
  },
  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
    borderRadius: 8,
    backgroundColor: '#6b6b6b',
    minHeight: 24,
    border: '3px solid #2b2b2b',
  },
  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
    backgroundColor: '#959595',
  },
  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
    backgroundColor: '#959595',
  },
  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#959595',
  },
  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
    backgroundColor: '#2b2b2b',
  },
};

const light = {
  main: '#f2f2f2',
  light: '#ffffff',
  dark: '#bfbfbf',
  contrastText: '#000000',
};

const dark = {
  main: '#424242',
  light: '#6d6d6d',
  dark: '#1b1b1b',
  contrastText: '#ffffff',
};

const custom = {
  palette: {
    orange: '#e25f22'
  }
};

const typography = {
  fontFamily: [
    'Roboto',
    'sans-serif',
  ].join(','),
};

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: light,
    secondary: dark,
  },
  custom: custom,
  typography: typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: scrollBodyLight,
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: dark,
    secondary: light,
  },
  custom: custom,
  typography: typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: scrollBodyDark,
      },
    },
  },
};