import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

const signUpUrl = API_BASE_URL + 'registerUser';
const loginUrl = API_BASE_URL + 'loginUser';

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        phonenumber: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setError(false);
    };

    const signup = useCallback(
        async (e) => {
            e.preventDefault();

            try {
                const signUpResponse = await axios.post(signUpUrl, form);
                
                if (!signUpResponse.data.user) {
                    setError(true);
                    return;
                }

                const loginResponse = await axios.post(loginUrl, {
                    email: form.email,
                    password: form.password,
                    gethash: 'X'
                });

                if (loginResponse.data.token) {
                    setUser(loginResponse.data.token);
                    navigate("/NewPatient");
                } else {
                    setError(true); // Error de autenticación
                }
            } catch (error) {
                console.log(error.message);
                setError(true); // Error de autenticación
            }
        },
        [setUser, form, username]
    );

    const { name, surname, email, phonenumber, password } = form;
    const emailClassName = error ? 'form-control is-invalid' : 'form-control';

    return (
        <div className="containerPrincipal">
            <div className="containerSecundario">
                <div className="form-group">
                    <label>Name:</label>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Surname:</label>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        name="surname"
                        value={surname}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Email:</label>
                    <br />
                    <input
                        type="text"
                        className={emailClassName}
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Phone Number:</label>
                    <br />
                    <input
                        type="text"
                        className="form-control"
                        name="phonenumber"
                        value={phonenumber}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        className={"form-control"}
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                    {error && <div className="invalid-feedback">{error.message}</div>}
                    <br />
                    <button className="btn btn-primary" onClick={signup}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;