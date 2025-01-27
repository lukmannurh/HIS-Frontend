import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Box } from '@mui/material';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4">Welcome, {auth.user?.username}!</Typography>
        <Typography variant="body1" mt={2}>
          This is your dashboard. From here, you can manage your reports, view your profile, and more.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
