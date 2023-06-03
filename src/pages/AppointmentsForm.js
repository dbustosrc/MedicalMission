import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from "@mui/material/TextField";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

import { useAuth } from "../context/Auth";

const appointmentsUrl = API_BASE_URL.URI + 'appointments';
const personsUrl = API_BASE_URL.URI + 'persons';
const periodsUrl = API_BASE_URL.URI + 'periods';
const medicalSpecialtiesUrl = API_BASE_URL.URI + 'medical-specializations';

const PersonListForm = () => {
    //Appointments
    const [appointmentParams, setAppointmentParams] = useState({
        period: '',
        person: '',
    });
    const [appointmentData, setAppointmentData] = useState({
        period: '',
        medicalSpecialization: '',
        person: '',
        attentionDate: '',
        observation: ''
    });
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    // Persons
    const [openPersonList, setOpenPersonList] = useState(false);
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const loadingPerson = openPersonList && persons.length === 0;

    // Periods
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [error, setError] = useState(false);

    // Medical Specialty
    const [medicalSpecialty, setMedicalSpecialty] = useState([]);
    const [selectedMedicalSpecialty, setSelectedMedicalSpecialty] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAppointmentList = async () => {
            try {
                const response = await axios.get(
                    `${appointmentsUrl}/period/${appointmentParams.period}/person/${appointmentParams.person}`,
                    {
                        headers: {
                            Authorization: user,
                        },
                    }
                );
                console.log(response);
                setFilteredAppointments(response.data);
            } catch (error) {
                console.error('Cannot fetch appointments:', error);
            }
        };

        // Filtrar las citas por el campo "person"
        if (appointmentParams.period && appointmentParams.person) {
            fetchAppointmentList();
        }
    }, [appointmentParams]);

    useEffect(() => {
        let active = true;

        if (!loadingPerson) {
            return undefined;
        }

        const fetchPersons = async () => {
            try {
                const response = await axios.get(personsUrl, {
                    headers: {
                        Authorization: user,
                    },
                });
                if (active) {
                    setPersons(response.data);
                }
            } catch (error) {
                console.error('Error al obtener los datos de las personas:', error);
            }
        };

        fetchPersons();

        return () => {
            active = false;
        };
    }, [loadingPerson, user]);

    useEffect(() => {
        let active = true;

        const fetchPeriods = async () => {
            try {
                const response = await axios.get(periodsUrl, {
                    headers: {
                        Authorization: user,
                    },
                });
                if (active) {
                    setPeriods(response.data);
                }
            } catch (error) {
                console.error('Error al obtener los datos de los periodos:', error);
            }
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

        return () => {
            active = false;
        };
    }, [user]);

    const handlePersonChange = (event, value) => {
        setSelectedPerson(value);
        if (value) {
            setAppointmentParams((prevParams) => ({
                ...prevParams,
                person: value._id,
            }));
        } else {
            setAppointmentParams((prevParams) => ({
                ...prevParams,
                person: '',
            }));
        }
    };

    const handlePeriodChange = (event, value) => {
        setSelectedPeriod(value);
        if (value) {
            setAppointmentParams((prevParams) => ({
                ...prevParams,
                period: value._id,
            }));
        } else {
            setAppointmentParams((prevParams) => ({
                ...prevParams,
                period: '',
            }));
        }
    };

    const handleMedicalSpecialtyChange = (event, value) => {
        setSelectedMedicalSpecialty(value);
        setAppointmentData({ ...appointmentData, medicalSpecialization: value });
    };

    const handleAttentionDateChange = (value) => {
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
            appointmentData.person = appointmentParams.person;
            appointmentData.period = appointmentParams.period;
            console.log(appointmentData);
            const appointmentResponse = await axios.post(appointmentsUrl, appointmentData, {
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
    };

    return (
        <div>
            <h1>Create Appointment</h1>
            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth error={error}>
                    <Autocomplete
                        open={openPersonList}
                        onOpen={() => {
                            setOpenPersonList(true);
                        }}
                        onClose={() => {
                            setOpenPersonList(false);
                        }}
                        options={persons}
                        getOptionLabel={(person) => `${person.idCardNumber}, ${person.firstname} ${person.paternallastname}`}
                        loading={loadingPerson}
                        value={selectedPerson}
                        onChange={handlePersonChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Person"
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loadingPerson ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
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
                            label="Attention date"
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Appointment Number</TableCell>
                            <TableCell>Medical Specialty</TableCell>
                            <TableCell>Attention Date</TableCell>
                            <TableCell>Observation</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell>{appointment.number}</TableCell>
                                <TableCell>{appointment.medicalSpecializationName}</TableCell>
                                <TableCell>{appointment.attentionDate}</TableCell>
                                <TableCell>{appointment.observation}</TableCell>
                                <TableCell>{appointment.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PersonListForm;
