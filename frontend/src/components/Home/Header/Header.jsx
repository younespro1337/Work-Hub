import * as React from 'react';
import { useDispatch , useSelector} from 'react-redux';
import logo from '../../../assets/images/svgLogo.svg'
import { hanldeFetchRequets } from '../../../actions/userAction';
import { IconButton, AppBar, Avatar, Typography, Box, Button } from '@mui/material/'
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { search } from '../../../actions/userAction';
import Notifications from './Notifications';
import { Search , SearchIconWrapper , StyledInputBase} from './Styled'
import { useSocket } from '../../../actions/socketService';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');



export default function Header() {
  const [loading , setLoading ] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [keyword, setKeyword ] = React.useState('')
  const navigate = useNavigate();
  const [requestData, setRequestData]= React.useState([])
  const [AvatarUrl, setAvatarUrl ] = React.useState('')
  const [notificationDialogOpen, setNotificationDialogOpen] = React.useState(false);
  const Ruser = useSelector(state => state.user.user);
  
 
useSocket("materialRequestsUpdate", (data) => {
console.log('socket data:', data);
});



  React.useEffect( () => {
    const fetchRequets = async () => {
 if (Ruser && Ruser._id) {
      const userId = Ruser._id;
      socket.emit('materialRequest', userId);
      const data = await hanldeFetchRequets({userId})
      setRequestData(data.requestData)
}
    }
    fetchRequets()
  }, [Ruser]);

  React.useEffect(() => {
    if (Ruser && Ruser.avatar && Ruser.avatar.url) {
      setAvatarUrl(Ruser.avatar.url);
    }
  }, [Ruser]);



const handleLogOut = () => {
  localStorage.clear();
  navigate('/singin');
  window.location.reload();
};



const handleNotificationsOpen = () => {
  setNotificationDialogOpen(true);
}

const handleNotificationsClose = () => {
  setNotificationDialogOpen(false);
}

const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
};

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    dispatch({ type: 'SET_MENU_CLOSE', payload: false }); 
  };


// three dots ... t/b
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  const toggleDrawer = () => {
    dispatch({ type: 'SET_MENU_OPEN', payload: !isMenuOpen }); 
    setOpen(!open);
  };
  
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      try {
        await search(keyword); 
        navigate(`/search/${keyword}`);
        navigate('/search');
      } catch (error) {
        console.error(error);
        navigate('/search');
      }
    } else {
      navigate('/search');
    }
  };
  

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
    <Link to= '/profile' style={{textDecoration:'none', color:'black'}} >  <MenuItem onClick={handleMenuClose}>Profile</MenuItem></Link>
    <Link to='/settings' style={{textDecoration:'none', color:'black'}}><MenuItem onClick={handleMenuClose}>My account</MenuItem></Link>
    <MenuItem onClick={handleLogOut}>
  <Button>Log Out</Button>
</MenuItem>

    </Menu>
  );

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
        <IconButton 
        size="large" 
        aria-label="show 4 new mails" 
        color="inherit"
        onClick={handleNotificationsOpen} 
        >
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <Typography>Messages</Typography>
      </MenuItem>

      <MenuItem>
      <IconButton
                size="large"
                aria-label={`show ${requestData?.requests?.length} new notifications`}
                color="inherit"
                onClick={handleNotificationsOpen} 
              >
                <Badge  badgeContent={requestData?.requests?.length} color="error">
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

        <Link to="/profile" style={{textDecoration:'none', color:'black'}}>Profile</Link>
      </MenuItem>
    </Menu>
  );


  return (
    <div style={{ marginBottom: '3%', minHeight:'65px', }}>
     
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" open={open}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Link to='/'>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                <Avatar src={logo} sx={{ color: 'white', background: 'transparent', width: '100px' }}>
                </Avatar>
              </Typography>
            </Link>


            <form action="" onSubmit={handleSubmit}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
              </Search>
            </form>


            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                <Link to="/inbox" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MailIcon />
                </Link>
                </Badge>
              </IconButton>



              <IconButton
                size="large"
                aria-label={`show ${requestData?.requests?.length} new notifications`}
                color="inherit"
                onClick={handleNotificationsOpen} 
              >
                <Badge  badgeContent={requestData?.requests?.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>



              <IconButton
                size="large"
                edge="end"
                aria-label="account of the current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={AvatarUrl}>
                  <AccountCircle />
                </Avatar>
              </IconButton>



            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <NavigationMenu />
        {renderMobileMenu}
        {renderMenu}
        
        <Notifications 
        open={notificationDialogOpen}
        close={handleNotificationsClose}
        requestData={requestData}
        loading={loading}
         />
      
      </Box>
   
    </div>
  );
}
