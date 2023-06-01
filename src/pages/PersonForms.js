import React, { useState, useEffect, ReactPaginate, useRef } from 'react';
import '../css/RegisterPacient.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
//import Modal from 'react-modal';
import AddressForm from './AddressForms';
import OccupationForm from './OccupationForms';
import { API_BASE_URL } from '../config';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'

// Define el elemento de la aplicación principal
//Modal.setAppElement('#root');

const personsUrl = API_BASE_URL.URI + 'persons';
const personUrl = API_BASE_URL.URI + 'person';
const ethnicGroupsUrl = API_BASE_URL.URI + 'ethnic-groups';
const occupationsUrl = API_BASE_URL.URI + 'occupations';
const countriesUrl = API_BASE_URL.URI + 'countries';
const regionsUrl = API_BASE_URL.URI + 'regions';
const regionsByCountryIdUrl = API_BASE_URL.URI + 'regions/country/';
const addressesUrl = API_BASE_URL.URI + 'addresses/getAddressesByParams';
const educationalLevelsUrl = API_BASE_URL.URI + 'educational-levels';

/*const addressButton = ({ handleShowForm }) => (
  <div>
    <button className="btn btn-primary" onClick={handleShowForm}>Create Address</button>
  </div>
);*/

const PersonCreateForm = () => {
  const [form, setForm] = useState({
    identification: '',
    firstname: '',
    secondname: '',
    paternallastname: '',
    maternalLastname: '',
    gender: '',
    ethnicGroup: [],
    occupation: '',
    birthdate: '',
    maritalStatus: '',
    phonenumber: '',
    address: [],
    educationalLevel: '',
    related: null,
    relationship: null,
    image: null
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(false);
  const [ethnicGroupform, ethnicGroupsetForm] = useState({
    id: '',
    name: ''
  });

  const genderOptions = [
    {
      name: "Male",
      id: "M"
    },
    {
      name: "Female",
      id: "F"
    }
  ];

  const maritalStatusOptions = [
    {
      name: "Single",
      id: "STATUS_SINGLE"
    },
    {
      name: "Married",
      id: "STATUS_MARRIED"
    },
    {
      name: "Divorcied",
      id: "STATUS_DIVORCIED"
    },
    {
      name: "Widowed",
      id: "STATUS_WIDOWED"
    },
    {
      name: "Non Marital Union",
      id: "STATUS_NON-MARITAL-UNION"
    }
  ];

  const occupationFormRef = useRef();
  const addressFormRef = useRef();

  const [genderParam, setGenderParam] = React.useState(genderOptions[0]);
  const [maritalStatusParam, setMaritalStatusParam] = React.useState(maritalStatusOptions[0]);

  const [addressParams, setAddressParams] = useState([]);
  const { country, region, address } = addressParams;

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isOccupationModalOpen, setIsOccupationModalOpen] = useState(false);
  const [occupationForm, setOccupationForm] = useState({
    name: ''
  });
  const [ethnicGroups, setEthnicGroups] = useState([]);
  const [selectedEthnicGroup, setSelectedEthnicGroup] = useState(null);

  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);

  const [educationalLevels, seteducationalLevels] = useState([]);
  const [selectedEducationalLevel, setSelectedEducationalLevel] = useState(null);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchEthnicGroups = async () => {
      try {
        const response = await axios.get(ethnicGroupsUrl, {
          headers: {
            Authorization: user
          }
        });
        setEthnicGroups(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOcupations = async () => {
      try {
        const response = await axios.get(occupationsUrl, {
          headers: {
            Authorization: user
          }
        });
        setOccupations(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEducationalLevels = async () => {
      try {
        const response = await axios.get(educationalLevelsUrl, {
          headers: {
            Authorization: user
          }
        });
        seteducationalLevels(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await axios.get(countriesUrl, {
          headers: {
            Authorization: user
          }
        });
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRegions = async () => {
      try {
        let response;
        if (selectedCountry) {
          response = await axios.get(regionsByCountryIdUrl + selectedCountry._id, {
            headers: {
              Authorization: user
            }
          });
        } else {
          response = await axios.get(regionsUrl, {
            headers: {
              Authorization: user
            }
          });
        }
        setRegions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAddresses = async () => {
      try {
        const addressParams = {
          country: selectedCountry ? selectedCountry._id : null,
          region: selectedRegion ? selectedRegion._id : null,
          address: selectedAddress ? selectedAddress._id : null
        };
        const response = await axios.post(addressesUrl, addressParams, {
          headers: {
            Authorization: user
          }
        });
        console.log(response.data);
        setAddresses(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
    fetchRegions();
    fetchAddresses();
    fetchEthnicGroups();
    fetchOcupations();
    fetchEducationalLevels();
  }, [isOccupationModalOpen, isAddressModalOpen, selectedCountry, selectedRegion]);

  const handleEthnicGroupChange = (event, value) => {
    setSelectedEthnicGroup(value);
  };
  const handleOccupationChange = (event, value) => {
    setSelectedOccupation(value);
  };

  const handleEducationalLevelChange = (event, value) => {
    setSelectedEducationalLevel(value);
  };

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
  };

  const handleRegionChange = (event, value) => {
    setSelectedRegion(value);
  };

  const handleAddressChange = (event, value) => {
    setSelectedAddress(value);
  };

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
    setError(false);
  };

  const handlePhonenumberChange = (value) => {
    setForm({ ...form, phonenumber: value });
    setError(false);
  };

  const handleBirthDateChange = (value) => {
    setForm({ ...form, birthdate: value });
    setError(false);
  };

  const registPerson = async () => {
    try {
      console.log(form);
      form.gender = genderParam.id;
      form.ethnicGroup = selectedEthnicGroup._id;
      form.occupation = selectedOccupation._id;
      form.maritalStatus = maritalStatusParam.id;
      form.address = selectedAddress._id;
      form.educationalLevel = selectedEducationalLevel._id;

      const response = await axios.post(personUrl, form, {
        headers: {
          Authorization: user
        }
      });

      if (response.data) {
        alert('ID Card Number Generated: ' + response.data.idCardNumber);
      }
      setForm({
        identification: '',
        firstname: '',
        secondname: '',
        paternallastname: '',
        maternalLastname: '',
        gender: '',
        ethnicGroup: [],
        occupation: '',
        birthdate: '',
        maritalStatus: '',
        phonenumber: '',
        address: [],
        educationalLevel: '',
        related: null,
        relationship: null,
        image: null
      });
    } catch (error) {
      alert('Error: ' + error.message);
      console.log(error.mesage);
    }
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const openOccupationModal = () => {
    setIsOccupationModalOpen(true);
  };

  const closeOccupationModal = () => {
    setIsOccupationModalOpen(false);
  };

  const handleOccupationFormSubmit = (e) => {
    if (occupationFormRef.current) {
      occupationFormRef.current.handleSubmit(e);
    }
  };

  const handleAddressFormSubmit = (e) => {
    if (addressFormRef.current) {
      addressFormRef.current.handleSubmit(e);
    }
  };

  return (
    <div className="form-group">
      <h1>Create Person</h1>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <InputLabel htmlFor="outlined-adornment-text">Identification</InputLabel>
          <OutlinedInput
            id="outlined-adornment-text"
            value={form.identification}
            onChange={handleChange("identification")}
            type="text"
            label="Identification"
            required="true"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <InputLabel htmlFor="outlined-adornment-text">Firstname</InputLabel>
          <OutlinedInput
            id="outlined-adornment-text"
            value={form.firstname}
            onChange={handleChange("firstname")}
            type="text"
            label="Firstname"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <InputLabel htmlFor="outlined-adornment-text">Secondname</InputLabel>
          <OutlinedInput
            id="outlined-adornment-text"
            value={form.secondname}
            onChange={handleChange("secondname")}
            type="text"
            label="Secondname"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <InputLabel htmlFor="outlined-adornment-text">Paternal Lastname</InputLabel>
          <OutlinedInput
            id="outlined-adornment-text"
            value={form.paternallastname}
            onChange={handleChange("paternallastname")}
            type="text"
            label="Paternal Lastname"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <InputLabel htmlFor="outlined-adornment-text">Maternal Lastname</InputLabel>
          <OutlinedInput
            id="outlined-adornment-text"
            value={form.maternallastname}
            onChange={handleChange("maternallastname")}
            type="text"
            label="Maternal Lastname"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            value={genderParam}
            onChange={(event, newValue) => {
              setGenderParam(newValue);
            }}
            disablePortal
            id="gender"
            getOptionLabel={(option) => option.name}
            options={genderOptions}
            sx={{ width: 300 }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.name}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Gender" />}
            required />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            options={ethnicGroups}
            getOptionLabel={(ethnicGroup) => ethnicGroup.name}
            value={selectedEthnicGroup}
            onChange={handleEthnicGroupChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ethnic Group"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
              <Autocomplete
                options={occupations}
                getOptionLabel={(occupation) => occupation.name}
                value={selectedOccupation}
                onChange={handleOccupationChange}
                renderInput={(params) => (
                  <TextField {...params} label="Occupation" variant="outlined" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: "10px",
                color: "#ffffff",
                backgroundColor: "#d01716",
                ml: "2em",
              }}
              onClick={openOccupationModal}
            >
              Create Occupation
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          {/*<Modal
            isOpen={isOccupationModalOpen}
            onRequestClose={closeOccupationModal}
            contentLabel="Occupation Modal"
            ariaHideApp={false}
          >
            <h2>Add Occupation</h2>
            <OccupationForm onSubmit={handleOccupationFormSubmit} />
            <button onClick={closeOccupationModal}>Cancel</button>
            </Modal>*/}
          <Dialog open={isOccupationModalOpen} onClose={closeOccupationModal}>
            <DialogTitle>Create Occupation</DialogTitle>
            <DialogContent>
              {/* Contenido del formulario de creación de ocupación */}
              <OccupationForm ref={occupationFormRef} />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeOccupationModal}>Cancel</Button>
              <Button onClick={handleOccupationFormSubmit}>Create</Button>
            </DialogActions>
          </Dialog>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Birthdate"
              value={form.birthdate}
              onChange={handleBirthDateChange}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            value={maritalStatusParam}
            onChange={(event, newValue) => {
              setMaritalStatusParam(newValue);
            }}
            disablePortal
            id="gender"
            getOptionLabel={(option) => option.name}
            options={maritalStatusOptions}
            sx={{ width: 300 }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.name}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Marital Status" />}
            required />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <PhoneInput value={form.phonenumber} onChange={handlePhonenumberChange} country={'ec'} required />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            options={educationalLevels}
            getOptionLabel={(educationalLevel) => educationalLevel.name}
            value={selectedEducationalLevel}
            onChange={handleEducationalLevelChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Educational Level"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            options={countries}
            getOptionLabel={(country) => country.name}
            value={selectedCountry}
            onChange={handleCountryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          <Autocomplete
            options={regions}
            getOptionLabel={(region) => region.name}
            value={selectedRegion}
            onChange={handleRegionChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Region"
                variant="outlined" />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
              <Autocomplete
                options={addresses}
                getOptionLabel={(address) => `${address.city}, ${address.district}, ${address.mainStreet}, ${address.numbering}`}
                value={selectedAddress}
                onChange={handleAddressChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    required
                  />
                )}
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: "10px",
                color: "#ffffff",
                backgroundColor: "#d01716",
                ml: "2em",
              }}
              onClick={openAddressModal}
            >
              Create Address
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
          {/*<Modal
            isOpen={isAddressModalOpen}
            onRequestClose={closeAddressModal}
            contentLabel="Address Form Modal"
          >
            <h2>Address Form</h2>
            <AddressForm />
            <button onClick={closeAddressModal}>Close</button>
            </Modal>*/}
          <Dialog open={isAddressModalOpen} onClose={closeAddressModal}>
            <DialogTitle>Create Address</DialogTitle>
            <DialogContent>
              {/* Contenido del formulario de creación de ocupación */}
              <AddressForm ref={addressFormRef} />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeAddressModal}>Cancel</Button>
              <Button onClick={handleAddressFormSubmit}>Create</Button>
            </DialogActions>
          </Dialog>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth="true"
          size="large"
          sx={{ mt: "10px", color: "#ffffff", backgroundColor: "#d01716" }}
          onClick={registPerson}
        >
          Create Person
        </Button>
      </Grid>
    </div>
  );
};

const PersonEditForm = () => {
};

const PersonListForm = () => {
  const [personList, setPersonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const perPage = 10; // Cantidad de elementos por página

  useEffect(() => {
    fetchPersonData(currentPage);
  }, [currentPage]);

  const fetchPersonData = (page) => {
    // Calcular el índice de inicio para la página actual
    const startIndex = page * perPage;

    // Realizar solicitud HTTP a la API para obtener los datos de las personas
    axios
      .get(`https://api.example.com/people?_start=${startIndex}&_limit=${perPage}`)
      .then((response) => {
        // Actualizar el estado con los datos recibidos de la API
        setPersonList(response.data);

        // Obtener la cantidad total de personas en la API
        axios.get('https://api.example.com/people/count').then((countResponse) => {
          // Calcular la cantidad total de páginas
          const totalCount = countResponse.data;
          const totalPages = Math.ceil(totalCount / perPage);
          setTotalPages(totalPages);
        });
      })
      .catch((error) => {
        console.error('Error al obtener los datos de las personas:', error);
      });
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de carné</th>
            <th>Número de identificación</th>
            <th>Primer nombre</th>
            <th>Segundo nombre</th>
            <th>Apellido paterno</th>
            <th>Apellido materno</th>
            <th>Género</th>
            <th>Grupo étnico</th>
            <th>Ocupación</th>
            <th>Fecha de nacimiento</th>
            <th>Estado civil</th>
            <th>Número de teléfono</th>
            <th>Dirección</th>
            <th>Nivel de educación</th>
            <th>Persona relacionada</th>
            <th>Relación</th>
            <th>Fecha de creación</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {personList.map((person) => (
            <tr key={person._id}>
              <td>{person.idNumber}</td>
              <td>{person.idCardNumber}</td>
              <td>{person.identification}</td>
              <td>{person.firstname}</td>
              <td>{person.secondname}</td>
              <td>{person.paternallastname}</td>
              <td>{person.maternalLastname}</td>
              <td>{person.gender}</td>
              <td>{person.ethnicGroup}</td>
              <td>{person.occupation}</td>
              <td>{person.birthdate}</td>
              <td>{person.maritalStatus}</td>
              <td>{person.phonenumber}</td>
              <td>{person.address}</td>
              <td>{person.educationalLevel}</td>
              <td>{person.related}</td>
              <td>{person.relationship}</td>
              <td>{person.creationDate}</td>
              <td>{person.image}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonCreateForm;
export { PersonListForm };
export { PersonEditForm };