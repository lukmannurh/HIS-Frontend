import React, { useContext } from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { ThemeContext } from '../../context/ThemeContext';

const TopNavbar = () => {
  const { toggleTheme, mode } = useContext(ThemeContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#88c273' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HIS
        </Typography>
        <Button color="inherit" component={RouterLink} to="/login">
          Login
        </Button>
        <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
