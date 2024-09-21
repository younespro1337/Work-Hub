import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Sitemark from './SitemarkIcon';
import { IconButton, AppBar, Box, Button, Badge, Typography, Avatar, MenuItem, Menu } from '@mui/material/';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';

// Import extracted components
// import ProfileMenu from './ProfileMenu'; // New ProfileMenu component
import Notifications from '../../Home/Header/Notifications'; // New Notifications component

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const Ruser = useSelector(state => state.user.user);
  const AvatarUrl = Ruser?.avatar?.url;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationDialogOpen, setNotificationDialogOpen] = React.useState(false);
  const [requestData, setRequestData] = React.useState([]);


const ProfileMenu = ({ anchorEl, isMenuOpen, handleMenuClose, handleLogOut }) => (
  <Menu
    anchorEl={anchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id="primary-profile-menu"
    open={isMenuOpen}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={handleMenuClose}>
      <Button component={Link} to="/profile" color="inherit">
        Profile
      </Button>
    </MenuItem>
    <MenuItem onClick={handleMenuClose}>
      <Button component={Link} to="/settings" color="inherit">
        Settings
      </Button>
    </MenuItem>
    <MenuItem onClick={handleLogOut}>
      <Button color="inherit">
        Log out
      </Button>
    </MenuItem>
  </Menu>
);



  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    dispatch({ type: 'SET_MENU_CLOSE', payload: false }); 
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = () => {
    setNotificationDialogOpen(true);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <Typography>Messages</Typography>
      </MenuItem>

      <MenuItem>
        <IconButton
          size="large"
          aria-label={`show ${requestData.length} new notifications`}
          color="inherit"
          onClick={handleNotificationsOpen}
        >
          <Badge badgeContent={requestData.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Typography>Notifications</Typography>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Typography>Profile</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 10 }}>
        <Container maxWidth="lg">
          <StyledToolbar>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Link to="/">
                <Sitemark />
              </Link>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button variant="text" color="info" size="small">Features</Button>
                <Button variant="text" color="info" size="small">Testimonials</Button>
                <Button variant="text" color="info" size="small">Highlights</Button>
                <Button variant="text" color="info" size="small">Pricing</Button>
                <Button variant="text" color="info" size="small">FAQ</Button>
                <Button variant="text" color="info" size="small">Blog</Button>
              </Box>
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {Ruser && Object.keys(Ruser).length > 0 ? (
                <>
                  <IconButton size="large" aria-label="show mails" color="inherit">
                    <Badge badgeContent={0} color="error">
                      <Link to="/inbox" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <MailIcon />
                      </Link>
                    </Badge>
                  </IconButton>

                  <IconButton size="large" aria-label="show notifications" color="inherit" onClick={handleNotificationsOpen}>
                    <Badge badgeContent={0} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-profile-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar src={AvatarUrl}>
                      <AccountCircle />
                    </Avatar>
                  </IconButton>

                  <Notifications
                    open={notificationDialogOpen}
                    close={handleNotificationsOpen}
                    requestData={requestData}
                  />
                </>
              ) : (
                <>
                  <Button component={Link} to="/singin" color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                  <Button component={Link} to="/singup" color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>f
                  </Box>
                  <MenuItem>Features</MenuItem>
                  <MenuItem>Testimonials</MenuItem>
                  <MenuItem>Highlights</MenuItem>
                  <MenuItem>Pricing</MenuItem>
                  <MenuItem>FAQ</MenuItem>
                  <MenuItem>Blog</MenuItem>
                  <MenuItem>
                    <Button 
                    color="primary" 
                    variant="contained" 
                    fullWidth
                    component={Link}
                    to='/singup'
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button 
                    color="primary" 
                    variant="outlined" 
                    fullWidth
                    component={Link}
                    to='/singin'
                    >
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      {renderMobileMenu}
      <ProfileMenu
        anchorEl={anchorEl}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
        handleLogOut={handleLogOut}
      />
    </>
  );
}
