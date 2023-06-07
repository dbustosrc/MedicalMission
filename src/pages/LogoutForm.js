import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "./bg/signin.png";
import bgimg from "./bg/backimg.jpg";

//Login CSS
import "../css/Login.css";

import { Container, TextField, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { useAuth } from "../context/Auth";


const LogoutForm = () => {
    const theme = createTheme();
    //Styles
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const matches = useMediaQuery(theme.breakpoints.down("md"));

    const handleSubmit = async (event) => {
        event.preventDefault();
        await logout(event);
    };

    const { user, setUser, setUserName, userName, signout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
          navigate("/signin");
        }
      }, [user, navigate]);

    const logout = useCallback(
        async (e) => {
            e.preventDefault();

            signout();
            navigate("/signin");
        },
        [setUser, setUserName]
    );

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${bgimg})`,
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "#f5f5f5",
                }}
            >
                <Box className="box-style">
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={6} className="grid-style">
                            <Box className="image-container-style" >
                                <img
                                    src={bg}
                                    alt="Signup"
                                    className="image-style"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} className="grid-style">
                            <Box
                                style={{
                                    backgroundSize: "cover",
                                    backgroundColor: "#455A64",
                                    height: matches ? "auto" : "70vh",
                                    minHeight: matches ? "auto" : "500px",
                                    display: "inherit",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container>
                                        <Box height={35} />
                                        <Box className="center-style">
                                            <Avatar className="avatar-style">
                                                <PersonIcon />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                {userName}
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="credentials-box-style"
                                        >
                                            <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    fullWidth="true"
                                                    size="large"
                                                    sx={{
                                                        mt: "10px",
                                                        color: "#ffffff",
                                                        backgroundColor: "#d01716",
                                                    }}
                                                >
                                                    Sign out
                                                </Button>
                                            </Grid>
                                            <Box height={35} />
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    );

    (
        <Container maxWidth="sm">
            <div style={{ textAlign: 'center', alignContent: 'center', justifyContent: 'center', gap: '4rem' }}>
                <h3 style={{ fontWeight: 'bold' }}>You are attempting to log out of Mindo Futures Medical Mission</h3>
                <h4>Are you sure?</h4>
                <h7 style={{ padding: '45px' }}>Logged in as {userName}</h7>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem' }}>
                <Button variant="contained" color="secondary" onClick={logout} size="large" sx={{ width: '30%' }}>
                    Log Out
                </Button>
            </div>
        </Container>
    );
};

export default LogoutForm;