import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppTheme from './shared-theme/AppTheme';
import { setMarginTop } from '../../../actions/userAction'; 
import { Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import GradientCircularProgress from '../../Layouts/loading';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

// Lazy load components
const AppNavbar = lazy(() => import('./components/AppNavbar'));
const Header = lazy(() => import('./components/Header'));
const MainGrid = lazy(() => import('./components/MainGrid'));
const SideMenu = lazy(() => import('./components/SideMenu'));

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setMarginTop('0px'));
  }, [dispatch]);

  return (
    <Suspense fallback={<GradientCircularProgress />}>
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 10,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  </Suspense>
  
  );
}
