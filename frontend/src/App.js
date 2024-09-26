import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Search from './components/Layouts/Search';
import Jobs from './components/Jobs/Jobs';
import Dashboard from './components/Admin/Charts/MainData.jsx';
import EditWorkers from './components/Admin/Workers/Main';
import EditMaterials from './components/Admin/Materials/Main';
import EditJobs from './components/Admin/Jobs/Main';
import Profile from './components/Home/profile/Main';
import LearnBoxes from './components/Home/article/learnMoreBox';
import MarketingPlan from './components/Home/article/Marketingblogs';
import Settings from './components/Home/Settings/Setting';
import ChatLayouts from './components/Home/ChatLayout/ChatLayout.jsx';
import Materials from './components/Home/Materials/Materials.jsx';
import Aboutus from './components/Home/AboutUs/about-us';
import ProtectedRoute from './Routes/ProtectedRoute.js';
import Resolver from './components/NewHome/Resolver.js';
import useGaTracker from './utils/GA.js';
import AppAppBar from './components/NewHome/components/AppAppBar.js';
import TemplateFrame from './components/NewHome/TemplateFrame.js';
import getMPTheme from './components/NewHome/theme/getMPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import SignInSide from './components/Login/SingIn/SignInSide.js';
import SignUp from './components/Login/SingUp/SingUp.js';
import { useSelector } from 'react-redux';
import Pricing from './components/NewHome/components/Pricing.js';
import ResetPassword from './components/Auth/ResetPassword.jsx';

const App = () => {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const MPTheme = createTheme(getMPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const marginTop = useSelector(state => state.layouts);

  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme(prev => !prev);
  };


  return (
    <Router>
        <TemplateFrame
          toggleCustomTheme={toggleCustomTheme}
          showCustomTheme={showCustomTheme}
          mode={mode}
          toggleColorMode={toggleColorMode}
        >
          <ThemeProvider theme={showCustomTheme ? MPTheme : defaultTheme}>
            <CssBaseline enableColorScheme />
            <UseGaTrackerWrapper>
              <AppAppBar />
              <div style={marginTop}>
                <Routes>
                <Route path="/" element={<Resolver />} />
                <Route path="/singin" element={<SignInSide />} />
                <Route path="/singup" element={<SignUp />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resetPassword/:token" element={<ResetPassword />} />

                  {/* User section */}
                  <Route path="/about-us" element={<ProtectedRoute><Aboutus /></ProtectedRoute>} />
                  <Route path="/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
                  <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                  <Route path="/Jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/inbox" element={<ProtectedRoute><ChatLayouts /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  {/* Admin Dashboard Section */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/edit-workers" element={<ProtectedRoute isAdmin={true}><EditWorkers /></ProtectedRoute>} />
                  <Route path="/admin/edit-materials" element={<ProtectedRoute isAdmin={true}><EditMaterials /></ProtectedRoute>} />
                  <Route path="/admin/edit-jobs" element={<ProtectedRoute isAdmin={true}><EditJobs /></ProtectedRoute>} />
                  {/* Additional Routes */}
                  <Route path="/learn-more" element={<LearnBoxes />} />
                  <Route path="/Marketing-plan" element={<MarketingPlan />} />
                </Routes>
              </div>
            </UseGaTrackerWrapper>
          </ThemeProvider>
        </TemplateFrame>
    </Router>
  );
};

const UseGaTrackerWrapper = ({ children }) => {
  useGaTracker();
  return children;
};

export default App;
