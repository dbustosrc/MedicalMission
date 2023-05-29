import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { API_BASE_URL } from '../config';
import { useAuth } from "../context/Auth";

const addressesUrl = API_BASE_URL + 'addresses';
const regionsUrl = API_BASE_URL + 'regions';

const AddressCreateForm = () => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  return (
    <div>
      <h2>Ingresar información de dirección</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mainStreet">Calle principal:</label>
        <input type="text" id="mainStreet" name="mainStreet" value={formData.mainStreet} onChange={handleChange} required />

        <label htmlFor="numbering">Número:</label>
        <input type="text" id="numbering" name="numbering" value={formData.numbering} onChange={handleChange} />

        <label htmlFor="intersection">Intersección:</label>
        <input type="text" id="intersection" name="intersection" value={formData.intersection} onChange={handleChange} />

        <label htmlFor="reference">Referencia:</label>
        <input type="text" id="reference" name="reference" value={formData.reference} onChange={handleChange} />

        <label htmlFor="postalCode">Código postal:</label>
        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} />

        <label htmlFor="city">Ciudad:</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />

        <label htmlFor="district">Distrito:</label>
        <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required />

        <label htmlFor="region">Región:</label>
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

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AddressCreateForm;
