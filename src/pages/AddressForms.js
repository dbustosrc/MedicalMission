import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { API_BASE_URL } from '../config';
import { useAuth } from "../context/Auth";

import Grid from "@mui/material/Grid";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useNavigate } from "react-router-dom";

const addressesUrl = API_BASE_URL.URI + 'addresses';
const regionsUrl = API_BASE_URL.URI + 'regions';

const AddressCreateForm = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    mainStreet: '',
    numbering: '',
    intersection: '',
    reference: '',
    postalCode: '',
    city: '',
    district: '',
    region: ''
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(regionsUrl, {
          headers: {
            Authorization: user
          }
        });
        console.log(response.data);
        setRegions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (event, value) => {
    setSelectedRegion(value);
  };

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      console.log(selectedRegion._id);
      formData.region = selectedRegion._id;
      const occupationResponse = await axios.post(addressesUrl, formData, {
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
      mainStreet: '',
      numbering: '',
      intersection: '',
      reference: '',
      postalCode: '',
      city: '',
      district: '',
      region: ''
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
            <Autocomplete
              options={regions}
              getOptionLabel={(region) => region.name}
              value={selectedRegion}
              onChange={handleRegionChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Region"
                  variant="outlined"
                  required />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">City</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.city}
              onChange={handleChange("city")}
              type="text"
              label="City"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">District</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.district}
              onChange={handleChange("district")}
              type="text"
              label="District"
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">Main Street</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.mainStreet}
              onChange={handleChange("mainStreet")}
              type="text"
              label="Main Street"
              required="true"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">Street Number</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.numbering}
              onChange={handleChange("numbering")}
              type="text"
              label="Street Number"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">Intersection</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.intersection}
              onChange={handleChange("intersection")}
              type="text"
              label="Intersection"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">Reference</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.reference}
              onChange={handleChange("reference")}
              type="text"
              label="Reference"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-text">Postal Code</InputLabel>
            <OutlinedInput
              id="outlined-adornment-text"
              value={formData.postalCode}
              onChange={handleChange("postalCode")}
              type="text"
              label="Postal Code"
            />
          </FormControl>
        </Grid>
      </form>
    </div>
  );
});

export default AddressCreateForm;
