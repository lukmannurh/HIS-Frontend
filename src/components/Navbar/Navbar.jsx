import React, { useContext } from 'react';

import SidebarNavbar from './SidebarNavbar';
import TopNavbar from './TopNavbar';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { auth } = useContext(AuthContext);
  const { toggleTheme, mode } = useContext(ThemeContext);

  return auth.isAuthenticated ? (
    <SidebarNavbar toggleTheme={toggleTheme} mode={mode} />
  ) : (
    <TopNavbar toggleTheme={toggleTheme} mode={mode} />
  );
};

export default Navbar;
