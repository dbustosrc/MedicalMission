import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import bg from "./bg/signin.png";
import bgimg from "./bg/backimg.jpg";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
//Login CSS
import "../css/Login.css";

import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

const baseUrl = API_BASE_URL.URI + 'loginUser';

const LoginForm = () => {
    const theme = createTheme();
    const [remember, setRemember] = useState(false);
    const { setUser, setUserName, setUserId, setUserRole } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await login(event);
    };

    //Styles
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const matches = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [values, setValues] = useState({
        email: "",
        password: "",
        gethash: "X",
    });

    const [error, setError] = useState(false);

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setError(false);
    };

    const signup = useCallback(
        async (e) => {
            e.preventDefault();
            navigate("/signup");
        },
        [navigate]
    );

    const login = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                const validateUser = {
                    email: values.email,
                    password: values.password,
                    gethash: ''
                };
                const validationResponse = await axios.post(baseUrl, validateUser);
                setUserName(validationResponse.data.user.name + ' ' + validationResponse.data.user.surname);
                setUserId(validationResponse.data.user._id);
                setUserRole(validationResponse.data.user.role);

                const loginResponse = await axios.post(baseUrl, values);
                if (loginResponse.data.token) {
                    setUser(loginResponse.data.token);
                    navigate("/");
                } else {
                    setError(true); // Error de autenticación
                }
            } catch (error) {
                console.log(error);
                setError(true); // Error de autenticación
            }
        },
        [values, setUser, navigate]
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
                                    alt="Signin"
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
                                                Sign In
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="credentials-box-style"
                                        >
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
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
                                                            label="Email"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={values.password}
                                                            onChange={handleChange("password")}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <LockIcon />
                                                                </InputAdornment>
                                                            }
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={handleClickShowPassword}
                                                                        onMouseDown={handleMouseDownPassword}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            label="Password"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em", textAlign: "inherit" }}>
                                                    <Stack direction="row" spacing={2}>
                                                        <FormControlLabel
                                                            sx={{ width: "60%" }}
                                                            onClick={() => setRemember(!remember)}
                                                            control={<Checkbox checked={remember} />}
                                                            label="Remember me"
                                                        />
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            onClick={() => {
                                                                navigate("/reset-password");
                                                            }}
                                                            style={{ marginTop: "10px", cursor: "pointer" }}
                                                        >
                                                            Forgot password?
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
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
                                                        Sign in
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography
                                                            variant="body1"
                                                            component="span"
                                                            style={{ marginTop: "10px", textAlign: "center" }}
                                                        >
                                                            Not registered yet?{" "}
                                                            <span
                                                                style={{ color: "#FF4081", cursor: "pointer" }}
                                                                onClick={signup}
                                                            >
                                                                Create an Account
                                                            </span>
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                                <Box height={35} />
                                            </Grid>
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








    //);
};

export default LoginForm;