import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useState, PropsWithChildren } from 'react';

export const FilterContainer = ({ children }: PropsWithChildren<{}>) => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme<BackstageTheme>();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  return isMidSizeScreen ? (
    <>
      <Button
        style={{ marginTop: theme.spacing(1), marginLeft: theme.spacing(1) }}
        onClick={() => setFilterDrawerOpen(true)}
        startIcon={<FilterListIcon />}
      >
        Filters
      </Button>
      <Drawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        anchor="left"
        disableAutoFocus
        keepMounted
        variant="temporary"
      >
        <Box m={2}>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginBottom: theme.spacing(1) }}
          >
            Filters
          </Typography>
          {children}
        </Box>
      </Drawer>
    </>
  ) : (
    <Grid item lg={2}>
      {children}
    </Grid>
  );
};