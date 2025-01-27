import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Box mt={10} textAlign="center">
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/dashboard">
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
