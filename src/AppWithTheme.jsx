import React, { useContext } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import App from './App';
import { ThemeContext } from './context/ThemeContext';

const AppWithTheme = () => {
  const { mode } = useContext(ThemeContext);
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#88c273',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export default AppWithTheme;
