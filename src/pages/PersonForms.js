import React, { useState, useEffect, ReactPaginate } from 'react';
import '../css/RegisterPacient.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Modal from 'react-modal';
import AddressForm from './AddressForms';
import OccupationForm from './OccupationForms';
import { API_BASE_URL } from '../config';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

// Define el elemento de la aplicación principal
Modal.setAppElement('#root');

const personsUrl = API_BASE_URL + 'persons';
const personUrl = API_BASE_URL + 'person';
const ethnicGroupsUrl = API_BASE_URL + 'ethnic-groups';
const occupationsUrl = API_BASE_URL + 'occupations';
const countriesUrl = API_BASE_URL + 'countries';
const regionsUrl = API_BASE_URL + 'regions';
const regionsByCountryIdUrl = API_BASE_URL + 'regions/country/';
const addressesUrl = API_BASE_URL + 'addresses/getAddressesByParams';
const educationalLevelsUrl = API_BASE_URL + 'educational-levels';

const Button = ({ handleShowForm }) => (
  <div>
    <button className="btn btn-primary" onClick={handleShowForm}>Create Address</button>
  </div>
);

const PersonCreateForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ethnicGroupform, ethnicGroupsetForm] = useState({
    id: '',
    name: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value
    }));
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
        navigate("/NewPatient");
      }
      setForm();
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

  const handleOccupationFormSubmit = async (formData) => {
    // Realizar las acciones necesarias con los datos del formulario
    closeOccupationModal();
  };

  return (
    <div className="form-group">
      <h1>Person and Appointments</h1>
      <label>Identification: </label>
      <input
        type="text"
        className="form-control"
        name="identification"
        onChange={handleChange}
      />
      <br />
      <label>Firstname: </label>
      <input
        type="text"
        className="form-control"
        name="firstname"
        onChange={handleChange}
      />
      <br />
      <label>Secondname: </label>
      <input
        type="text"
        className="form-control"
        name="secondname"
        onChange={handleChange}
      />
      <br />
      <label>Paternal Lastname: </label>
      <input
        type="text"
        className="form-control"
        name="paternallastname"
        onChange={handleChange}
      />
      <br />
      <label>Maternal Lastname: </label>
      <input
        type="text"
        className="form-control"
        name="maternalLastname"
        onChange={handleChange}
      />
      <br />
      <label>Gender:</label>
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
      <br />
      <label>Ethnic Group:</label>
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
      <label>Occupation:</label>
      <Autocomplete
        options={occupations}
        getOptionLabel={(occupation) => occupation.name}
        value={selectedOccupation}
        onChange={handleOccupationChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Occupation"
            variant="outlined"
          />
        )}
      />
      <button className="btn btn-primary" onClick={openOccupationModal}>Add Occupation</button>
      <Modal
        isOpen={isOccupationModalOpen}
        onRequestClose={closeOccupationModal}
        contentLabel="Occupation Modal"
        ariaHideApp={false}
      >
        <h2>Add Occupation</h2>
        <OccupationForm onSubmit={handleOccupationFormSubmit} />
        <button onClick={closeOccupationModal}>Cancel</button>
      </Modal>
      <br />
      <label>Birthdate:</label>
      <input
        type="date"
        className="form-control"
        name="birthdate"
        onChange={handleChange}
      />
      <br />
      <label>Marital Status:</label>
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
      <br />
      <label>Phone Number: </label>
      <input
        type="text"
        className="form-control"
        name="phonenumber"
        onChange={handleChange}
      />
      <br />
      <label>Educational Level:</label>
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
      <div>
        <h4>Address</h4>
        <label>Country:</label>
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
        <label>Region:</label>
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
        <label>Address:</label>
        <Autocomplete
          options={addresses}
          getOptionLabel={(address) => address.mainStreet}
          value={selectedAddress}
          onChange={handleAddressChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Address"
              variant="outlined"
              required />
          )}
          required />
        {isAddressModalOpen && <AddressForm />}
        <Button handleShowForm={openAddressModal} />

        <Modal
          isOpen={isAddressModalOpen}
          onRequestClose={closeAddressModal}
          contentLabel="Address Form Modal"
        >
          <h2>Address Form</h2>
          <AddressForm />
          <button onClick={closeAddressModal}>Close</button>
        </Modal>
        <br />
      </div>
      <button className="btn btn-primary" onClick={registPerson}>Create</button>
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