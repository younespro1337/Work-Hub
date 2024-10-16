import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Sitemark from "./SitemarkIcon";
import {
  IconButton,
  AppBar,
  Box,
  Button,
  Badge,
  Typography,
  Avatar,
  MenuItem,
  Menu,
  TextField,
  ListItemIcon
} from "@mui/material/";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Settings, ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import Notifications from "./Notifications"; 
import { hanldeFetchRequets } from "../../../actions/userAction";
import { useSocket } from '../../../actions/socketService';
import openSocket from 'socket.io-client';



const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: "8px 12px",
}));


export default function AppAppBar({ testimonialsRef, featuresRef, highlightsRef, pricingRef, faqRef}) {
  const socket = openSocket('http://localhost:5000');
  const [open, setOpen] = React.useState(false);
  const {avatar , firstName, lastName, _id} = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const dispatch = useDispatch();
  const [notificationDialogOpen, setNotificationDialogOpen] = React.useState(false);
  const [requestData, setRequestData] = React.useState([]);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [notificationCount,setNotificationCount] = React.useState(0);


  useSocket("materialRequestsUpdate", (data) => {
    console.log('socket data:', data);
    });



  React.useEffect( () => {
    const fetchRequets = async () => {
 if (_id) {
      const userId = _id;
      socket.emit('materialRequest', userId);
      const data = await hanldeFetchRequets({userId})
      setRequestData(data.requestData);
      console.log(data.requestData);
      // setNotificationCount(data.requestData.requests.length);
}
    }
    fetchRequets()
  }, [_id]);



  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      console.log('Scrolling to section:', ref.current); 
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('Ref not found:', ref); 
    }
  };

  
  const ProfileMenu = ({
    anchorEl,
    isMenuOpen,
    handleMenuClose,
    handleLogOut,
  }) => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-profile-menu"
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 4,
        style: {
          borderRadius: '8px',
          padding: '8px 0',
          minWidth: '200px',
        },
      }}
    >
      <MenuItem onClick={handleMenuClose} sx={{ padding: "10px 20px" }}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <Button
          component={Link}
          to="/profile"
          color="inherit"
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          Profile
        </Button>
      </MenuItem>
  
      <MenuItem onClick={handleMenuClose} sx={{ padding: "10px 20px" }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <Button
          component={Link}
          to="/settings"
          color="inherit"
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          Settings
        </Button>
      </MenuItem>
  
      <MenuItem onClick={handleLogOut} sx={{ padding: "10px 20px" }}>
        <ListItemIcon>
          <ExitToApp fontSize="small" />
        </ListItemIcon>
        <Button
          color="inherit"
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
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
    dispatch({ type: "SET_MENU_CLOSE", payload: false });
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/singin";
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchTerm(''); 
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // console.log("Searching for:", searchTerm);
    setSearchOpen(false);
  };


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = () => {
    setNotificationDialogOpen(true);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
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
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar>
            {/* Logo */}
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
            >
              <Link to="/">
                <Sitemark />
              </Link>

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Button variant="text" color="info" size="small" onClick={() => scrollToSection(featuresRef)}>
                  Features
                </Button>
                <Button variant="text" color="info" size="small" onClick={() => scrollToSection(testimonialsRef)}>
                  Testimonials
                </Button>
                <Button variant="text" color="info" size="small" onClick={() => scrollToSection(highlightsRef)}>
                  Highlights
                </Button>
                <Button variant="text" color="info" size="small" onClick={() => scrollToSection(pricingRef)}>
                  Pricing
                </Button>
                <Button variant="text" color="info" size="small" onClick={() => scrollToSection(faqRef)}>
                  FAQ
                </Button>
                <Button variant="text" color="info" size="small">
                  Blog
                </Button>
              </Box>


            </Box>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
             <IconButton 
             onClick={handleSearchToggle} 
             color="inherit"
             size="large" 
             >
                <Badge color="error">
                  <Typography variant="body1">🔍</Typography>
                </Badge>
              </IconButton>
              

              {searchOpen && (
                <form onSubmit={handleSearchSubmit}>
                  <TextField
                    size="medium"
                    variant="outlined"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ ml: 1, mr:10, width:'90%' }}
                    
                  />
                </form>
              )}




<Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>

{_id && Object.keys(_id).length > 0 ? (
  <>
    <IconButton size="large" color="inherit">
      <Badge badgeContent={0} color="error" showZero>
        <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <DashboardIcon />
        </Link>
      </Badge>
    </IconButton>

    <IconButton size="large" color="inherit">
      <Badge badgeContent={1000} color="error" showZero>
        <Link to="/inbox" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MailIcon />
        </Link>
      </Badge>
    </IconButton>
    <Notifications
                    open={notificationDialogOpen}
                    close={handleNotificationsOpen}
                    requestData={requestData}
                  />

    <IconButton 
    onClick={handleProfileMenuOpen} 
    size="large"
    color="inherit"
    >
      <Avatar
        src={avatar.url}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = ""; 
        }}
      >
        {firstName?.charAt(0).toUpperCase() || 'R'}
      </Avatar>
    </IconButton>



   
  </>
) : (
  <>
    <Button component={Link} to="/signin" color="primary" variant="text" size="small">
      Sign in
    </Button>
    <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
      Sign up
    </Button>
  </>
)}

</Box>
           
           
           </Box>


            {/* Mobile Menu */}
            <Box sx={{ display: { sm: "flex", md: "none" } }}>
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                    
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
                      to="/singup"
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
                      to="/singin"
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
