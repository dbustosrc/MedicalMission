import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from "@mui/material/TextField";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CheckIcon from '@mui/icons-material/Check';

import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

const appointmentsUrl = API_BASE_URL.URI + 'appointments';
const personsUrl = API_BASE_URL.URI + 'persons';
const periodsUrl = API_BASE_URL.URI + 'periods';
const medicalSpecialtiesUrl = API_BASE_URL.URI + 'medical-specializations';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#455A64',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

const PersonListForm = () => {
    const navigate = useNavigate();

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
    const [reloadTable, setReloadTable] = useState(false);

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
        if (!user) {
            navigate("/signin");
        }
    }, [user, navigate]);

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
    }, [appointmentParams, reloadTable]);

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

    useEffect(() => {
        if (reloadTable) {
            setReloadTable(false);
        }
    }, [reloadTable]);


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
            const appointmentResponse = await axios.post(appointmentsUrl, appointmentData, {
                headers: {
                    Authorization: user
                }
            });
            console.log(appointmentResponse);
            setReloadTable(true);
        }
        catch (error) {
            console.log(error);
        }

        setAppointmentData({
            period: '',
            medicalSpecialization: '',
            person: '',
            attentionDate: '',
            observation: ''
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
            <TableContainer sx={{ mt: "2em" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Appointment Number</StyledTableCell>
                            <StyledTableCell>Medical Specialty</StyledTableCell>
                            <StyledTableCell>Attention Date</StyledTableCell>
                            <StyledTableCell>Observation</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow hover key={appointment._id}>
                                <TableCell>{appointment.number}</TableCell>
                                <TableCell>{appointment.medicalSpecializationName}</TableCell>
                                <TableCell>{new Date(appointment.attentionDate).toLocaleDateString('en-US', dateOptions)}</TableCell>
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

const AppointmentsConfirmationForm = () => {
    //Appointments
    const [appointmentParams, setAppointmentParams] = useState({
        period: '',
        person: '',
    });
    const [appointmentData, setAppointmentData] = useState({
        status: '',
    });
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);

    // Persons
    const [openPersonList, setOpenPersonList] = useState(false);
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const loadingPerson = openPersonList && persons.length === 0;

    // Periods
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [error, setError] = useState(false);

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
                setFilteredAppointments(response.data.filter(appointments => appointments.status === 'STATUS_ON-HOLD'));
            } catch (error) {
                console.error('Cannot fetch appointments:', error);
            }
        };

        // Filtrar las citas por el campo "person"
        if (appointmentParams.period && appointmentParams.person) {
            fetchAppointmentList();
        }
    }, [appointmentParams, reloadTable]);

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

        fetchPeriods();

        return () => {
            active = false;
        };
    }, [user]);

    useEffect(() => {
        if (reloadTable) {
            setReloadTable(false);
        }
    }, [reloadTable]);


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
    const handleReloadTable = () => {
        setReloadTable(prevState => !prevState);
    };


    return (
        <div>
            <h1>Appointments Confirmation</h1>
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell />
                            <StyledTableCell>Appointment Number</StyledTableCell>
                            <StyledTableCell>Medical Specialty</StyledTableCell>
                            <StyledTableCell>Attention Date</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map(appointment => (
                            <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const AppointmentsListForm = () => {
    //Appointments
    const [appointmentParams, setAppointmentParams] = useState({
        period: '',
        person: '',
        attentionDate: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);

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

    // Attention Date
    const [selectedAttentionDate, setSelectedAttentionDate] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        const fetchAppointmentList = async () => {
            try {
                const response = await axios.get(
                    `${appointmentsUrl}/unfiltered/period/${appointmentParams.period}/attention-date/${appointmentParams.attentionDate}`,
                    {
                        headers: {
                            Authorization: user,
                        },
                    }
                );
                console.log(response);
                setAppointments(response.data);
                if (appointmentParams.person?._id) {
                    setFilteredAppointments(response.data.filter(appointments => appointments.personId === appointmentParams.person._id));
                } else {
                    setFilteredAppointments(response.data);
                };
            } catch (error) {
                console.error('Cannot fetch appointments:', error);
            }
        };

        // Filtrar las citas por el campo "person"
        if (appointmentParams.period && appointmentParams.attentionDate) {
            fetchAppointmentList();
        }
    }, [appointmentParams.period, appointmentParams.attentionDate, reloadTable]);

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

    useEffect(() => {
        if (reloadTable) {
            setReloadTable(false);
        }
    }, [reloadTable]);

    useEffect(() => {
        if (selectedPerson !== null) {
            console.log(appointments);
            console.log(selectedPerson._id);
            setFilteredAppointments(appointments.filter(appointments => appointments.personId === selectedPerson._id));
        } else {
            setFilteredAppointments(appointments);
        };
        console.log(selectedPerson);
    }, [reloadTable, selectedPerson]);

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

    const handleAttentionDateChange = (value) => {
        let attentionDate = '';
        if (value && typeof value.isBefore === 'function') {
            attentionDate = dayjs(value).toISOString();
        }
        setSelectedAttentionDate(value);

        setAppointmentParams((prevParams) => ({
            ...prevParams,
            attentionDate: attentionDate,
        }));
    };

    return (
        <div>
            <h1>Appointments List</h1>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Attention date"
                            value={appointmentParams.attentionDate}
                            onChange={handleAttentionDateChange}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Grid>
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
            <TableContainer sx={{ mt: "2em" }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell />
                            <StyledTableCell>Appointment Number</StyledTableCell>
                            <StyledTableCell>ID Card</StyledTableCell>
                            <StyledTableCell>Person fullname</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAppointments.map(appointment => (
                            <ViewRow key={appointment._id} row={appointment} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        position: PropTypes.number,
        number: PropTypes.number.isRequired,
        idCardNumber: PropTypes.string,
        personName: PropTypes.string,
        attentionDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        medicalSpecializationName: PropTypes.string,
        observation: PropTypes.string,
    }).isRequired,
};

function ViewRow(props) {
    const { user } = useAuth();
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [appointmentParams, setAppointmentParams] = useState({
        _id: row._id,
        status: row.status,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentStatus = {
                status: appointmentParams.status
            };
            if (appointmentStatus.status !== row.status) {
                const appointmentResponse = await axios.put(`${appointmentsUrl}/${appointmentParams._id}`, appointmentStatus, {
                    headers: {
                        Authorization: user
                    }
                });
                console.log(appointmentResponse);
                props.handleReloadTable();
            };
        }
        catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        if (appointmentParams.status) {
            const e = { preventDefault: () => { } };
            handleSubmit(e);
        }
    }, [appointmentParams.status]);

    return (
        <Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell component="th" scope="row">{row.idCardNumber}</TableCell>
                <TableCell>{row.personName}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Appointment detail
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Medical Specialty</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.idCardNumber}>
                                        <TableCell component="th" scope="row">
                                            {row.medicalSpecializationName}
                                        </TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

function Row(props) {
    const { user } = useAuth();
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [appointmentParams, setAppointmentParams] = useState({
        _id: row._id,
        status: row.status,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentStatus = {
                status: appointmentParams.status
            };
            if (appointmentStatus.status !== row.status) {
                const appointmentResponse = await axios.put(`${appointmentsUrl}/${appointmentParams._id}`, appointmentStatus, {
                    headers: {
                        Authorization: user
                    }
                });
                console.log(appointmentResponse);
                props.handleReloadTable();
            };
        }
        catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        if (appointmentParams.status) {
            const e = { preventDefault: () => { } };
            handleSubmit(e);
        }
    }, [appointmentParams.status]);

    return (
        <Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.number}</TableCell>
                <TableCell>{row.medicalSpecializationName}</TableCell>
                <TableCell>{new Date(row.attentionDate).toLocaleDateString('en-US', dateOptions)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Appointment detail
                            </Typography>
                            <Typography gutterBottom component="div">
                                Observation: {row.observation}
                            </Typography>
                            <Grid container spacing={0} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth={true}
                                        size="large"
                                        startIcon={<CheckIcon />}
                                        onClick={(event, newValue) => {
                                            setAppointmentParams({
                                                ...appointmentParams,
                                                status: 'STATUS_CONFIRMED',
                                            });
                                        }}
                                        sx={{
                                            mt: "10px",
                                            color: "#ffffff",
                                            backgroundColor: "#d01716",
                                            width: "100%",
                                        }}
                                    >
                                        Confirm Appointment
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default PersonListForm;
export { AppointmentsConfirmationForm }
export { AppointmentsListForm }