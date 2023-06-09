/*import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!user && (
          <li>
            <Link to="/signin">Sign in</Link>
          </li>
        )}
        {user && (
          <>
            <li>
              <Link to="/signout">Sign out</Link>
            </li>
            <li>
              <Link to="/CreatePerson">New Person</Link>
            </li>
            <li>
              <Link to="/ListPersons">New Appointment</Link>
            </li>
          </>
        )}
      </ul>
      <Outlet />
    </div>
  );
};

export default Layout;
*/
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

import React, { useState, useEffect, useRef } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItemButton from '@mui/material/ListItemButton';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ListIcon from '@mui/icons-material/List';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SecurityIcon from '@mui/icons-material/Security';
import GradingIcon from '@mui/icons-material/Grading';
import GroupsIcon from '@mui/icons-material/Groups';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SvgIcon from '@mui/material/SvgIcon';
import { RiVimeoFill } from 'react-icons/ri';
import MindoFuturesIcon from '../pages/bg/MindoFutures.ico';
import { Icon } from '@mui/material';

const drawerWidth = 240;

const theme = createTheme({
  /*typography: {
    // Define your typography styles here
  },*/
  palette: {
    primary: {
      main: '#b11116',
    },
    secondary: {
      main: '#e51c23',
    },
  },
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin'),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    marginLeft: 0,
  }),
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh', // Establecemos la altura mínima del componente a 100vh (alto de la ventana)
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  minHeight: '64px', // Adjust the height as needed
}));

const BottomButtonsContainer = styled('div')({
  position: 'absolute',
  bottom: 0,
  width: '100%',
});

const Footer = styled('footer')({
  marginTop: 'auto',
  backgroundColor: '#455A64',
  padding: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const FooterText = styled('span')({
  marginRight: '10px',
  color: 'white',
});

const SocialIconsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const SocialIcon = styled('span')({
  marginRight: '10px',
  cursor: 'pointer',
});

const SocialIconLink = styled('a')({
  marginRight: '10px',
  color: 'white',
});

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const Logo = styled('img')({
  width: '24px',
  height: '24px',
  marginRight: '8px',
});

const Layout = () => {
  const navigate = useNavigate();
  const { userName, user, userRole } = useAuth();
  const [open, setOpen] = React.useState(false);
  const drawerRef = useRef(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = () => {
    // Handle profile menu open logic
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateSignIn = () => {
    navigate('/signin');
  };

  const handleNavigateCreatePerson = () => {
    navigate('/CreatePerson');
  };

  const handleNavigateListPersons = () => {
    navigate('/ListPersons');
  };

  const handleNavigateCreateAppointments = () => {
    navigate('/CreateAppointment');
  };

  const handleNavigateAppointmentsConfirmation = () => {
    navigate('/AppointmentsConfirmation');
  };

  const handleNavigateSignOut = () => {
    navigate('/signout');
  };

  const handleSetUserAllocations = () => {
    navigate('/UsersAdministration');
  };

  const handlenNavigateAppointmentsList = () => {
    navigate('/AppointmentsList');
  }


  const menuId = 'account-menu';

  // Manejador de eventos para cerrar el panel lateral cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutsideDrawer = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            {/* Añade tu ícono personalizado aquí */}
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Mindo Futures Medical Mission
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label={`account of ${userName}`}
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
              <ListItemText primary={userName} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          ref={drawerRef}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            ...(open && { width: drawerWidth }),
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItemButton onClick={handleNavigateHome} /*HOME*/>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            {user ? (
              <>
                {userRole === 'ROLE_ADMIN' && (
                  <ListItemButton onClick={handleSetUserAllocations} /*Set Users Allocations*/>
                    <ListItemIcon>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users Administration" />
                  </ListItemButton>
                )}
                {userRole === 'ROLE_ADMIN' && (
                <ListItemButton onClick={handleNavigateCreatePerson} /*Register Person*/>
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register Person" />
                </ListItemButton>
                )}
                <ListItemButton onClick={handleNavigateListPersons} /*People List*/>
                  <ListItemIcon>
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText primary="People List" />
                </ListItemButton>
                <ListItemButton onClick={handlenNavigateAppointmentsList} /*Appointments List*/>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appointments List" />
                </ListItemButton>
                {userRole === 'ROLE_ADMIN' && (
                <ListItemButton onClick={handleNavigateCreateAppointments} /*Register Appointments*/>
                  <ListItemIcon>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register Appointments" />
                </ListItemButton>
                )}
                <ListItemButton onClick={handleNavigateAppointmentsConfirmation} /*Appointments Confirmation*/>
                  <ListItemIcon>
                    <GradingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appointments Confirmation" />
                </ListItemButton>
              </>
            ) : null};
          </List>
          <BottomButtonsContainer>
            {!user ? (
              <ListItemButton onClick={handleNavigateSignIn}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            ) : (
              <ListItemButton onClick={handleNavigateSignOut}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            )};
          </BottomButtonsContainer>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Footer>
            <FooterText>
              Developed and designed by David R. Bustos 2023.
            </FooterText>
            <SocialIconsContainer>
              {/* Logos de redes sociales */}
              <SocialIconLink component="a" href="https://www.facebook.com/MindoFutures" target="_blank">
                <FacebookIcon />
              </SocialIconLink >
              <SocialIconLink component="a" href="https://www.instagram.com/MindoFutures" target="_blank">
                <InstagramIcon />
              </SocialIconLink >
              <SocialIconLink component="a" href="https://twitter.com/mindofutures" target="_blank">
                <TwitterIcon />
              </SocialIconLink >
              <SocialIconLink component="a" href="https://vimeo.com/mindofutures" target="_blank">
                <RiVimeoFill size={24} />
              </SocialIconLink >
            </SocialIconsContainer>
          </Footer>
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
