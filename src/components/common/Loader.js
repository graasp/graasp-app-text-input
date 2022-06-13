import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material';

const StyledGrid = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  flex: 1,
  margin: theme.spacing(4),
}));

const Loader = () => (
  <Grid container spacing={0}>
    <StyledGrid item xs={12}>
      <CircularProgress />
    </StyledGrid>
  </Grid>
);

export default Loader;
