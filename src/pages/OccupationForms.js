import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from "../context/Auth";

const occupationsUrl = API_BASE_URL + 'occupations';

const OccupationCreateForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const occupationResponse = await axios.post(occupationsUrl, formData, {
                headers: {
                    Authorization: user
                }
            });
            console.log(occupationResponse);
        }
        catch (error) {
            console.log(error);
        }
        // Resetear el formulario
        setFormData({
            name: ''
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default OccupationCreateForm;
