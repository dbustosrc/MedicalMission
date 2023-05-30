import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, TextField, Button } from '@mui/material';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

const baseUrl = API_BASE_URL.URI + 'loginUser';

const LoginForm = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

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
                console.log(API_BASE_URL);
                const loginResponse = await axios.post(baseUrl, values);
                if (loginResponse.data.token) {
                    setUser(loginResponse.data.token);
                    navigate("/CreatePerson");
                } else {
                    setError(true); // Error de autenticación
                }
            } catch (error) {
                setError(true); // Error de autenticación
            }
        },
        [values, setUser, navigate]
    );

    //    const { email, password } = form;
    const emailClassName = error ? 'form-control is-invalid' : 'form-control';
    const passwordClassName = error ? 'form-control is-invalid' : 'form-control';

    return (
        <Container maxWidth="sm">
            <h1>Login</h1>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem' }}>
                <Button variant="contained" color="primary" onClick={login} size="large" sx={{ width: '30%' }}>
                    Login
                </Button>
                <Button variant="contained" color="secondary" onClick={signup} size="large" sx={{ width: '30%' }}>
                    Sign Up
                </Button>
            </div>
        </Container>
    );
};

export default LoginForm;