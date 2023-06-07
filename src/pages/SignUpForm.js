import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import bg from "./bg/signin.png";
import bgimg from "./bg/backimg.jpg";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//Login CSS
import "../css/Login.css";

import { Container, Button } from '@mui/material';
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
import { API_BASE_URL } from '../config';

const signUpUrl = API_BASE_URL.URI + 'registerUser';
const loginUrl = API_BASE_URL.URI + 'loginUser';

const SignUpForm = () => {
    const theme = createTheme();
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signup(event);
    };

    //Styles
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const matches = useMediaQuery(theme.breakpoints.down("md"));

    const [errorName, setNameError] = useState(false);
    const [errorSurname, setSurnameError] = useState(false);
    const [errorPhone, setPhoneError] = useState(false);
    const [errorEmail, setEmailError] = useState(false);
    const [errorPassword, setPasswordError] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        //setError(false);
    };

    const [values, setValues] = useState({
        name: '',
        surname: '',
        phonenumber: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const handleNameBlur = useCallback(() => {
        if (!values.name) {
            setNameError(true);
        } else {
            setNameError(false);
        }
    }, [values.name]);

    const handleSurnameBlur = useCallback(() => {
        if (!values.surname) {
            setSurnameError(true);
        } else {
            setSurnameError(false);
        }
    }, [values.surname]);

    const handlePhoneBlur = useCallback(() => {
        if (!values.phonenumber) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
    }, [values.phonenumber]);

    const handleEmailBlur = useCallback(() => {
        if (!values.email) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }, [values.email]);

    const handlePasswordBlur = useCallback(() => {
        if (values.password !== values.repeatPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    }, [values.password, values.repeatPassword]);

    const signup = useCallback(
        async (e) => {
            e.preventDefault();
            if (errorName === false
                && errorSurname === false
                && errorPhone === false
                && errorEmail === false
                && errorPassword === false) {
                try {
                    const signUpResponse = await axios.post(signUpUrl, values);
                    if (!signUpResponse.data.user) {
                        setNameError(true);
                        setSurnameError(true);
                        setPhoneError(true);
                        setEmailError(true);
                        setPasswordError(true);
                        return;
                    }

                    const loginResponse = await axios.post(loginUrl, {
                        email: values.email,
                        password: values.password,
                        gethash: 'X'
                    });

                    if (loginResponse.data.token) {
                        setUser(loginResponse.data.token);
                        navigate("/");
                    } else {
                        // Error de autenticación
                        setNameError(true);
                        setSurnameError(true);
                        setPhoneError(true);
                        setEmailError(true);
                        setPasswordError(true);
                        return;
                    }
                } catch (error) {
                    if (error.response.status === 409) {
                        setEmailError(true);
                    } else {
                        // Error de autenticación
                        setNameError(true);
                        setSurnameError(true);
                        setPhoneError(true);
                        setEmailError(true);
                        setPasswordError(true);
                    }
                    return;
                }
            } else {
                console.log("Error en los datos");
            };

        },
        [setUser, values, errorName, errorSurname, errorPhone, errorEmail, errorPassword, navigate]
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
                                                <LockOutlinedIcon />
                                            </Avatar>
                                            <Typography component="h1" variant="h4">
                                                Create Account
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="credentials-box-style"
                                        >
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorName}>
                                                    <InputLabel htmlFor="outlined-adornment-person">Name</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-person"
                                                        value={values.name}
                                                        onChange={handleChange("name")}
                                                        type="person"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <PersonIcon />
                                                            </InputAdornment>
                                                        }
                                                        onBlur={handleNameBlur}
                                                        label="Name"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorSurname}>
                                                    <InputLabel htmlFor="outlined-adornment-person">Surname</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-person"
                                                        value={values.surname}
                                                        onChange={handleChange("surname")}
                                                        type="person"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <PersonIcon />
                                                            </InputAdornment>
                                                        }
                                                        onBlur={handleSurnameBlur}
                                                        label="Surname"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorPhone}>
                                                    <InputLabel htmlFor="outlined-adornment-phone">Phone</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-phone"
                                                        value={values.phonenumber}
                                                        onChange={handleChange("phonenumber")}
                                                        type="phone"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <PhoneIcon />
                                                            </InputAdornment>
                                                        }
                                                        onBlur={handlePhoneBlur}
                                                        label="Phone"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorEmail}>
                                                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-email"
                                                        value={values.email}
                                                        onChange={handleChange("email")}
                                                        type="email"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <EmailIcon />
                                                            </InputAdornment>
                                                        }
                                                        onBlur={handleEmailBlur}
                                                        label="Email"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorPassword}>
                                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-password"
                                                        type='password'
                                                        value={values.password}
                                                        onChange={handleChange("password")}
                                                        onBlur={handlePasswordBlur}
                                                        label="Password"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={errorPassword}>
                                                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-password"
                                                        type='password'
                                                        value={values.repeatPassword}
                                                        onChange={handleChange("repeatPassword")}
                                                        onBlur={handlePasswordBlur}
                                                        label="Confirm Password"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    fullWidth="true"
                                                    size="large"
                                                    sx={{
                                                        mt: "15px",
                                                        mr: "20px",
                                                        color: "#ffffff",
                                                        backgroundColor: "#d01716",
                                                    }}
                                                >
                                                    Register
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                <Stack direction="row" spacing={2}>
                                                    <Typography
                                                        variant="body1"
                                                        component="span"
                                                        style={{ marginTop: "10px", textAlign: "center" }}
                                                    >
                                                        Already have an Account?{" "}
                                                        <span
                                                            style={{ color: "#FF4081", cursor: "pointer" }}
                                                            onClick={() => {
                                                                navigate("/signin");
                                                            }}
                                                        >
                                                            Sign In
                                                        </span>
                                                    </Typography>
                                                </Stack>
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
};

export default SignUpForm;