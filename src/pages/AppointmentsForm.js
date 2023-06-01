import React, { useState, useEffect } from 'react';
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

import Grid from "@mui/material/Grid";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const personsUrl = API_BASE_URL.URI + 'persons';
const appointmetsUrl = API_BASE_URL.URI + 'getAppointmentsByParams';
const periodsUrl = API_BASE_URL.URI + 'periods';
const medicalSpecialtiesUrl = API_BASE_URL.URI + 'medical-specializations';
const appointmentUrl = API_BASE_URL.URI + 'appointments';
const PersonListForm = () => {
    const { user } = useAuth();

    const [personData, setPersonData] = useState({
        idCardNumber: '',
        identification: '',
        firstname: '',
        secondname: '',
        paternallastname: '',
        maternalLastname: '',
        gender: '',
        ethnicGroup: '',
        occupation: '',
        birthdate: '',
        maritalStatus: '',
        phonenumber: '',
        address: '',
        educationalLevel: '',
        related: '',
        relationship: '',
    });

    const [appointmentData, setAppointmentData] = useState({
        period: '',
        medicalSpecialization: '',
        person: '',
        attentionDate: '',
        observation: ''
    });

    const [personList, setPersonList] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [medicalSpecialty, setMedicalSpecialty] = useState([]);
    const [selectedMedicalSpecialty, setSelectedMedicalSpecialty] = useState(null);
    const [appointmentList, setAppointmentList] = useState([]);
    const [appointmentParams, setAppointmentParams] = useState({
        period: [],
        person: []
    });
    const [error, setError] = useState(false);
    const [person, setPerson] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handlePersonChange = (event, value) => {
        setSelectedPerson(value);
    };
    const handlePeriodChange = (event, value) => {
        setSelectedPeriod(value);
    };
    const handleMedicalSpecialtyChange = (event, value) => {
        setSelectedMedicalSpecialty(value);
    };

    useEffect(() => {
        const fetchPeriods = async () => {
            // Realizar solicitud HTTP a la API para obtener los datos de las personas
            axios
                .get(periodsUrl, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    // Actualizar el estado con los datos recibidos de la API
                    console.log(response.data);
                    setPeriods(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de los periodos:', error);
                });
        }
        const fetchAppointmentList = async () => {
            // Realizar solicitud HTTP a la API para obtener los datos de las personas
            axios
                .get(appointmetsUrl, appointmentParams, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    // Actualizar el estado con los datos recibidos de la API
                    setAppointmentList(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de las citas:', error);
                });
        }
        const fetchPersons = async () => {
            // Realizar solicitud HTTP a la API para obtener los datos de las personas
            axios
                .get(personsUrl, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    // Actualizar el estado con los datos recibidos de la API
                    setPersonList(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de las personas:', error);
                });
        };
        const fetchMedicalSpecialty = async () => {
            // Realizar solicitud HTTP a la API para obtener los datos de las personas
            axios
                .get(medicalSpecialtiesUrl, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    // Actualizar el estado con los datos recibidos de la API
                    setMedicalSpecialty(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de las especialidades médicas:', error);
                });
        };
        fetchMedicalSpecialty();
        fetchPeriods();
        fetchAppointmentList();
        fetchPersons();
    }, [user, personList, appointmentList]);

    const handleAttentionDateChange = (value) => {
        console.log(value);
        setAppointmentData({ ...appointmentData, attentionDate: value });
        setError(false);
    };
    const handleChange = (prop) => (event) => {
        setAppointmentData({ ...appointmentData, [prop]: event.target.value });
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            appointmentData.person = selectedPerson._id;
            appointmentData.period = selectedPeriod._id;
            appointmentData.medicalSpecialization = selectedMedicalSpecialty._id;
            console.log(appointmentData);
            const appointmentResponse = await axios.post(appointmentUrl, appointmentData, {
              headers: {
                Authorization: user
              }
            });
            console.log(appointmentResponse);
          }
          catch (error) {
            console.log(error);
          }

        setAppointmentData({
            period: '',
            medicalSpecialization: '',
            person: '',
            attentionDate: '',
            observation: '',
            status: '',
        });
        setAppointmentList([...appointmentList, appointmentData]);
        setPersonData({
            idCardNumber: '',
            identification: '',
            firstname: '',
            secondname: '',
            paternallastname: '',
            maternalLastname: '',
            gender: '',
            ethnicGroup: '',
            occupation: '',
            birthdate: '',
            maritalStatus: '',
            phonenumber: ''
        });
    };

    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                        <Autocomplete
                            options={personList}
                            getOptionLabel={(person) => `${person.idCardNumber}, ${person.firstname} ${person.paternallastname}`}
                            value={selectedPerson}
                            onChange={handlePersonChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Person"
                                    variant="outlined"
                                />
                            )}
                            required
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                        <Autocomplete
                            options={periods}
                            getOptionLabel={(period) => `${period.name}, ${period.year}`}
                            value={selectedPeriod}
                            onChange={handlePeriodChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Period"
                                    variant="outlined"
                                />
                            )}
                            required
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                        <Autocomplete
                            options={medicalSpecialty}
                            getOptionLabel={(medicalSpecialty) => `${medicalSpecialty.name}`}
                            value={selectedMedicalSpecialty}
                            onChange={handleMedicalSpecialtyChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Medical Specialty"
                                    variant="outlined"
                                />
                            )}
                            required
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Attention Date"
                                value={appointmentData.attentionDate}
                                onChange={handleAttentionDateChange}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                    <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                        <InputLabel htmlFor="outlined-adornment-text">Observation</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-text"
                            value={appointmentData.observation}
                            onChange={handleChange("observation")}
                            type="text"
                            label="Observation"
                            required="true"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth="true"
                        size="large"
                        sx={{ mt: "10px", color: "#ffffff", backgroundColor: "#d01716" }}
                        onClick={handleSubmit}
                    >
                        Add Appointment
                    </Button>
                </Grid>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Medical Specialty</th>
                        <th>Attention Date</th>
                        <th>Observation</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointmentList.map((person, index) => (
                        <tr key={index}>
                            <td>{person.period}</td>
                            <td>{person.medicalSpecialization}</td>
                            <td>{person.attentionDate}</td>
                            <td>{person.observation}</td>
                            <td>{person.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default PersonListForm;