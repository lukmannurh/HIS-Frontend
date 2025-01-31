import React, { useContext } from 'react';

import SidebarNavbar from './SidebarNavbar';
import TopNavbar from './TopNavbar';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { auth } = useContext(AuthContext);

  return auth.isAuthenticated ? <SidebarNavbar /> : <TopNavbar />;
};

export default Navbar;
