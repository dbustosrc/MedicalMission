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

import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

const baseUrl = API_BASE_URL + 'loginUser';

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState("");
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /*   const [form, setForm] = useState({
           email: '',
           password: '',
           gethash: 'x',
       });*/
    const [error, setError] = useState(false);


    /*    const handleChange = (e) => {
            const { name, value } = e.target;
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
            setError(false);
        };*/
    const signup = useCallback(
        async (e) => {
            e.preventDefault();
            navigate("/signup");
        }
    );

    const login = useCallback(
        async (e) => {
            e.preventDefault();

            try {
                console.log({ email, password, gethash: 'x' });
                const loginResponse = await axios.post(baseUrl, { email, password, gethash: 'x' });
                console.log(loginResponse);
                if (loginResponse.data.token) {
                    setUser(loginResponse.data.token);
                    navigate("/NewPatient");
                } else {
                    setError(true); // Error de autenticación
                }
            } catch (error) {
                setError(true); // Error de autenticación
            }
        },
        [email, password]
    );

    //    const { email, password } = form;
    const emailClassName = error ? 'form-control is-invalid' : 'form-control';
    const passwordClassName = error ? 'form-control is-invalid' : 'form-control';

    return (
        <Container maxWidth="sm">
            <h1>Login Page</h1>
            <TextField
                label="E-mail"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
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
            <Button variant="contained" onClick={login}>
                Login
            </Button>
            <Button variant="contained" onClick={signup}>
                Sign Up
            </Button>
        </Container>

        /*<div className="containerPrincipal">
            <div className="containerSecundario">
                <div className="form-group">
                    <label>Email: </label>
                    <br />
                    <input
                        type="text"
                        className={emailClassName}
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Contraseña: </label>
                    <br />
                    <input
                        type="password"
                        className={passwordClassName}
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                    {error && <div className="invalid-feedback">Datos incorrectos</div>}
                    <br />
                    <button className="btn btn-primary" onClick={login}>
                        Login
                    </button>
                    <button className="btn btn-primary" onClick={signup}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>*/
    );
};

export default LoginForm;