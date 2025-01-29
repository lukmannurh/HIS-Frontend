import React, { createContext, useState, useMemo } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#66bb6a', // Hijau muda
          },
          secondary: {
            main: '#ff9800', // Oranye untuk aksen
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
