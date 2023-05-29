import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/Auth";


const LogoutForm = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const logout = useCallback(
        async (e) => {
            e.preventDefault();

            setUser(null);
            navigate("/");
        },
        [setUser]
    );

    return (
        <div className="containerPrincipal">
            <div className="containerSecundario">
                <div className="form-group">
                    <button className="btn btn-primary" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutForm;