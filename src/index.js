import React from 'react';

import ReactDOM from 'react-dom/client';

import AppWithTheme from './AppWithTheme';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import './index.css';
import '@fontsource/roboto';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <AuthProvider>
        <AppWithTheme />
      </AuthProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
