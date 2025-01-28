import React from 'react';
import { Container, Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </Typography>
    </Container>
  );
};

export default Unauthorized;
