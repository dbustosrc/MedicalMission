import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputAdornment, OutlinedInput, Radio, RadioGroup, FormLabel, FormControlLabel, Button, TextField, Autocomplete, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockResetIcon from '@mui/icons-material/LockReset';

const usersUrl = API_BASE_URL.URI + 'users';
const periodsUrl = API_BASE_URL.URI + 'periods';
const allocationsUrl = API_BASE_URL.URI + 'users-allocations';
const medicalSpecialtiesUrl = API_BASE_URL.URI + 'medical-specializations';

const UsersAdministration = () => {
    // Users
    const [users, setUsers] = useState([]);

    //Allocations
    const [allocations, setAllocations] = useState(null);
    const [triageAllocation, setTriageAllocation] = useState(null);
    const [pharmacistAllocation, setPharmacistAllocation] = useState(null);

    // Periods
    const [periods, setPeriods] = useState([]);

    // Medical Specialties
    const [medicalSpecialties, setMedicalSpecialties] = useState([]);
    const [filteredMedicalSpecialties, setFilteredMedicalSpecialties] = useState([]);

    // Form
    const [selectedParams, setSelectedParams] = useState({
        user: null,
        period: null,
        medicalSpecialty: null,
        userProfile: null,
        triageAllocation: null,
        pharmacistAllocation: null,
        doormanAllocation: null,
        password: null
    });
    const [reloadTable, setReloadTable] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(usersUrl, {
                    headers: {
                        Authorization: user,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de usuarios:', error);
            }
        };
        const fetchPeriods = async () => {
            try {
                const response = await axios.get(periodsUrl, {
                    headers: {
                        Authorization: user,
                    },
                });
                setPeriods(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de los periodos:', error);
            }
        };

        const fetchMedicalSpecialties = async () => {
            // Realizar solicitud HTTP a la API para obtener los datos de las personas
            axios
                .get(medicalSpecialtiesUrl, {
                    headers: {
                        Authorization: user
                    }
                })
                .then((response) => {
                    // Actualizar el estado con los datos recibidos de la API
                    setMedicalSpecialties(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los datos de las especialidades médicas:', error);
                });
        };

        fetchMedicalSpecialties();
        fetchPeriods();
        fetchUsers();
    }, [user]);

    const handleDeleteAllocation = (allocationId) => {
        try {
            axios.delete(`${allocationsUrl}/${allocationId}`, {
                headers: {
                    Authorization: user,
                },
            });
            setReloadTable(true);
        } catch (error) {
            console.error('Error al eliminar la asignación:', error);
        }
    };

    const handleResetPassword = () => {
        try {
            const updatepwdParams = {
                email: selectedParams.user.email,
                newPassword: selectedParams.password
            };

            axios.put(`${usersUrl}/password`, updatepwdParams, {
                headers: {
                    Authorization: user,
                },
            });

            setSelectedParams({
                ...selectedParams,
                password: ''
            });
        } catch (error) {
            console.error('Error al eliminar la asignación:', error);
        }
    };

    const HandleUserProfileChange = (event) => {
        if (event.target.value === 'pharmacist') {
            setSelectedParams({
                ...selectedParams,
                userProfile: event.target.value,
                pharmacistAllocation: true,
                triageAllocation: false,
                doormanAllocation: false
            });
        };

        if (event.target.value === 'triage') {
            setSelectedParams({
                ...selectedParams,
                userProfile: event.target.value,
                pharmacistAllocation: false,
                triageAllocation: true,
                doormanAllocation: false
            });
        };

        if (event.target.value === 'doorman') {
            setSelectedParams({
                ...selectedParams,
                userProfile: event.target.value,
                pharmacistAllocation: false,
                triageAllocation: false,
                doormanAllocation: true
            });
        };
    };

    useEffect(() => {
        const fetchPeriodUserAllocations = async () => {
            try {
                const response = await axios.get(`${allocationsUrl}/period/${selectedParams.period._id}/user/${selectedParams.user._id}`,
                    {
                        headers: {
                            Authorization: user,
                        },
                    });

                setAllocations(response.data.filter(allocations => allocations.triage === false
                    && allocations.pharmacist === false));
                setTriageAllocation(response.data.filter(allocations => allocations.triage === true));
                setPharmacistAllocation(response.data.filter(allocations => allocations.pharmacist === true));

                let userProfileAlloc = null;
                if (response.data.filter(allocations => allocations.triage === true).length > 0) {
                    userProfileAlloc = 'triage';
                };

                if (response.data.filter(allocations => allocations.pharmacist === true).length > 0) {
                    userProfileAlloc = 'pharmacist';
                };

                if (userProfileAlloc === null) {
                    userProfileAlloc = 'doorman';
                };

                selectedParams.userProfile = userProfileAlloc;

                setSelectedParams({
                    ...selectedParams,
                    medicalSpecialty: null,
                });
            } catch (error) {
                console.error('Error al obtener las asignaciones de usuarios:', error);
            }
        };

        if (selectedParams.user?._id && selectedParams.period?._id) {
            fetchPeriodUserAllocations();
        };
    }, [selectedParams.user, selectedParams.period, reloadTable]);

    useEffect(() => {
        if (allocations && medicalSpecialties) {
            setFilteredMedicalSpecialties(medicalSpecialties.filter((specialty) => {
                return !allocations.some((allocation) => {
                    return allocation.medicalSpecializationId === specialty._id;
                });
            }));
        };
    }, [allocations, reloadTable]);

    useEffect(() => {
        const AppendMedicalSpecialtyToUserAllocations = async () => {
            try {
                const userAllocationParams = {
                    user: selectedParams.user._id,
                    period: selectedParams.period._id,
                    medicalSpecialization: selectedParams.medicalSpecialty._id
                }
                const response = await axios.post(allocationsUrl, userAllocationParams,
                    {
                        headers: {
                            Authorization: user,
                        },
                    });
                setReloadTable(true);
            } catch (error) {
                console.error('Error al obtener las asignaciones de usuarios:', error);
            }
        };

        if (selectedParams.medicalSpecialty?._id && selectedParams.user?._id && selectedParams.period?._id) {
            AppendMedicalSpecialtyToUserAllocations();
        };
    }, [selectedParams.medicalSpecialty]);

    useEffect(() => {
        const changeToTriageProfile = async () => {
            const triageAllocationParams = {
                user: selectedParams.user._id,
                period: selectedParams.period._id,
                triage: true
            };
            await deleteAllAllocations();
            await saveNewAllocation(triageAllocationParams);
        };

        const changeToPharmacistProfile = async () => {
            const pharmacistAllocationParams = {
                user: selectedParams.user._id,
                period: selectedParams.period._id,
                pharmacist: true
            };
            await deleteAllAllocations();
            await saveNewAllocation(pharmacistAllocationParams);
        };

        const changeToDoormanProfile = async () => {
            await deleteAllAllocations();
        };

        const saveNewAllocation = async (allocationParams) => {
            try {
                await axios.post(`${allocationsUrl}`, allocationParams, {
                    headers: {
                        Authorization: user
                    }
                });
                setReloadTable(true);
            } catch (error) {
                console.error('Error al cambiar el perfil de usuario:', error);
            }
        };

        const deleteAllAllocations = async () => {
            try {
                const allocationIds = [...triageAllocation, ...pharmacistAllocation, ...allocations].map(allocation => allocation._id);
                const deletePromises = allocationIds.map(allocationId => deleteAllocation(allocationId));
                await Promise.all(deletePromises);
            } catch (error) {
                console.error('Error al eliminar las asignaciones:', error);
            }
        };

        const deleteAllocation = async (allocationId) => {
            try {
                await axios.delete(`${allocationsUrl}/${allocationId}`, {
                    headers: {
                        Authorization: user
                    }
                });
            } catch (error) {
                console.error('Error al eliminar la asignación:', error);
            }
        };

        if (selectedParams.user?._id && selectedParams.period?._id) {
            if (selectedParams.triageAllocation) {
                changeToTriageProfile().then(() => setReloadTable(true));
            }
            if (selectedParams.pharmacistAllocation) {
                changeToPharmacistProfile().then(() => setReloadTable(true));
            }
            if (selectedParams.doormanAllocation) {
                changeToDoormanProfile().then(() => setReloadTable(true));
            }
        }
    }, [selectedParams.triageAllocation, selectedParams.pharmacistAllocation, selectedParams.doormanAllocation]);


    useEffect(() => {
        if (reloadTable) {
            setReloadTable(false);
        }
    }, [reloadTable]);

    return (
        <>
            <Typography variant="h4" gutterBottom component="div">
                Users Administration
            </Typography>
            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                    <Autocomplete
                        options={users}
                        getOptionLabel={(user) => `${user.name} ${user.surname}, ${user.email}`}
                        value={selectedParams.user}
                        onChange={(event, newValue) => {
                            setSelectedParams({
                                ...selectedParams,
                                user: newValue,
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="User"
                                variant="outlined"
                            />
                        )}
                        required
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                    <Autocomplete
                        options={periods}
                        getOptionLabel={(period) => `${period.name}, ${period.year}`}
                        value={selectedParams.period}
                        onChange={(event, newValue) => {
                            setSelectedParams({
                                ...selectedParams,
                                period: newValue,
                            });
                        }}
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
            <Typography variant="h6" gutterBottom component="div">
                Reset user password
            </Typography>
            <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type='password'
                        value={selectedParams.password}
                        onChange={(event) => {
                            setSelectedParams({
                                ...selectedParams,
                                password: event.target.value,
                            });
                        }}
                        label="Password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleResetPassword()}>
                                    <LockResetIcon fontSize='large' />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Grid>
            <FormControl>
                <Typography variant="h6" gutterBottom component="div">
                    User Profile
                </Typography>
                <RadioGroup
                    row
                    value={selectedParams.userProfile}
                    onChange={HandleUserProfileChange}
                >
                    <FormControlLabel value="doorman" control={<Radio />} label="Doorman" />
                    <FormControlLabel value="pharmacist" control={<Radio />} label="Pharmacist" />
                    <FormControlLabel value="triage" control={<Radio />} label="Triage" />
                </RadioGroup>
            </FormControl>
            {selectedParams.userProfile === 'doorman' && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Medical Specialties</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allocations.map((allocation) => (
                                /*<Box display="flex" alignItems="center">
                                    <Box flexGrow={1}>{allocation.medicalSpecializationName}</Box>
                                    <IconButton onClick={() => handleDeleteAllocation(allocation._id)}>
                                        <ClearIcon fontSize='large' />
                                    </IconButton>
                                </Box>*/
                                <FormControl>
                                    <OutlinedInput
                                        id="outlined-adornment-specialization"
                                        type="text"
                                        value={allocation.medicalSpecializationName}
                                        readOnly
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => handleDeleteAllocation(allocation._id)}>
                                                    <ClearIcon fontSize="medium" />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Medical Specialization"
                                    />
                                </FormControl>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <Autocomplete
                                        options={filteredMedicalSpecialties}
                                        getOptionLabel={(option) => option.name}
                                        value={selectedParams.medicalSpecialty}
                                        onChange={(event, newValue) => {
                                            setSelectedParams({
                                                ...selectedParams,
                                                medicalSpecialty: newValue,
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Medical Specialty"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default UsersAdministration;