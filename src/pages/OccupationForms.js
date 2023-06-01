//import React, { useState } from 'react';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from "../context/Auth";

import Grid from "@mui/material/Grid";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

const occupationsUrl = API_BASE_URL.URI + 'occupations';

const OccupationCreateForm = forwardRef((props, ref) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: ''
    });

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
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

    // Utiliza useImperativeHandle para exponer la función handleSubmit
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-text">Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-text"
                            value={formData.name}
                            onChange={handleChange("name")}
                            type="text"
                            label="Name"
                            required="true"
                        />
                    </FormControl>
                </Grid>
            </form>
        </div>
    );
});

export default OccupationCreateForm;
