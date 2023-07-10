import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

import { Box, Tab, Tabs, Grid, FormControl, Autocomplete, TextField, Table, TableCell, TableBody, TableHead, TableRow, Paper, TableContainer, Typography, Button } from "@mui/material/";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import SearchBar from '../components/searchbar';
import StyledTableCell from '../components/styledtablecell';
import Row from '../components/row';

import dayjs from 'dayjs';

const userAllocationsUrl = API_BASE_URL.URI + 'users-allocations';
const periodsUrl = API_BASE_URL.URI + 'periods';
const appointmentsUrl = API_BASE_URL.URI + 'appointments';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

const HomeForm = () => {
  const navigate = useNavigate();
  const { user, userId } = useAuth();
  
  //Appointments
  const [appointmentParams, setAppointmentParams] = useState({
    period: '',
    attentionDate: '',
    medicalSpecialty: '',
  });
  const [filteredAppointments, setFilteredAppointments] = useState(null);
  const [reloadTable, setReloadTable] = useState(false);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

  // Periods
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // User Allocations
  const [userAllocations, setUserAllocations] = useState([]);
  const [userPharmacyAllocation, setUserPharmacyAllocation] = useState([]);

  // Attention Date
  const [selectedAttentionDate, setSelectedAttentionDate] = useState([]);

  //Medical Specialty
  const [selectedMedicalSpecialty, setSelectedMedicalSpecialty] = useState(null);

  //Pharmacy
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  //Collapsible table
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);

  // Screen
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  //Searchbar
  //const [search, setSearch] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  useEffect(() => {
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

    fetchPeriods();
  }, [user]);

  useEffect(() => {
    const fetchUserAllocations = async () => {
      try {
        const response = await axios.get(`${userAllocationsUrl}/period/${selectedPeriod._id}/user/${userId}`, {
          headers: {
            Authorization: user,
          },
        });
        setUserAllocations(response.data.filter(response => response.medicalSpecializationId !== null));
        setUserPharmacyAllocation(response.data.filter(response => response.pharmacist === true));
      } catch (error) {
        console.error('Error al obtener los datos de las asignaciones:', error);
      }
    };

    fetchUserAllocations();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchAppointmentForPrescriptionsList = async () => {
      try {
        const response = await axios.get(
          `${appointmentsUrl}/period/${appointmentParams.period}/attention-date/${appointmentParams.attentionDate}`,
          {
            headers: {
              Authorization: user,
            },
          }
        );
        setFilteredPrescriptions(response.data);
      } catch (error) {
        console.error('Cannot fetch appointments:', error);
      }
    }
    const fetchAppointmentList = async () => {
      try {
        const response = await axios.get(
          `${appointmentsUrl}/period/${appointmentParams.period}/medical-specialty/${appointmentParams.medicalSpecialty}/attention-date/${appointmentParams.attentionDate}`,
          {
            headers: {
              Authorization: user,
            },
          }
        );
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Cannot fetch appointments:', error);
      }
    };

    // Filtrar las citas por el campo "person"
    if (appointmentParams.period && appointmentParams.medicalSpecialty && appointmentParams.attentionDate) {
      fetchAppointmentList();
    } else {
      console.log(appointmentParams.period, appointmentParams.medicalSpecialty, appointmentParams.attentionDate);
    }

    //Filtrar las citas por por recetar
    if (appointmentParams.period && appointmentParams.attentionDate) {
      fetchAppointmentForPrescriptionsList();
    } else {
      console.log(appointmentParams.period, appointmentParams.attentionDate);
    }
  }, [appointmentParams, reloadTable]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleReloadTable = () => {
    setReloadTable(prevState => !prevState);
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
    handleMedicalSpecialtyChange(event, 0);
    handlePharmacyChange(event, 0);
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

    handleMedicalSpecialtyChange(this, 0);
  };

  const handlePharmacyChange = (event, value) => {
    setSelectedPharmacy(value);
  }

  const handleMedicalSpecialtyChange = (event, value) => {
    setSelectedMedicalSpecialty(value);
    if (userAllocations[value]) {
      setAppointmentParams((prevParams) => ({
        ...prevParams,
        medicalSpecialty: userAllocations[value].medicalSpecializationId,
      }));
    } else {
      setAppointmentParams((prevParams) => ({
        ...prevParams,
        medicalSpecialty: '',
      }));
    }
  };

  const onSearchChange = (filteredValues) => {
    setFilteredAppointments(filteredValues);
  };

  return (
    <div>
      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        >
          {isCollapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          <Typography variant="h5" component="span">
            Clinics & Pharmacy
          </Typography>
        </IconButton>
        <Collapse in={isCollapseOpen} timeout="auto" unmountOnExit>
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
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
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Attention date"
                value={selectedAttentionDate}
                onChange={handleAttentionDateChange}
              />
            </LocalizationProvider>
          </FormControl>
        </Collapse>
      </Grid>
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
      >
        {userPharmacyAllocation.length > 0 && (
          <Tabs
            variant="scrollable"
            value={selectedPharmacy}
            onChange={handlePharmacyChange}
            aria-label="Pharmacy"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {userPharmacyAllocation.map((userAllocation) => (
              <Tab label={userAllocation.medicalSpecializationName} key={userAllocation._id} />
            ))}
          </Tabs>
        )}
      </Box>
      {selectedPharmacy != null && userPharmacyAllocation.length > 0 && (
        <TableContainer component={Paper}>
          {filteredPrescriptions
            .filter(appointment => appointment.status === 'STATUS_PRESCRIBED').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Prescriptions Queue</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />
                      <StyledTableCell>Position</StyledTableCell>
                      <StyledTableCell>Full name</StyledTableCell>
                      <StyledTableCell>Medical Specialty</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPrescriptions
                      .filter(appointment => appointment.status === 'STATUS_PRESCRIBED')
                      .map(appointment => (
                        <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
          {filteredPrescriptions
            .filter(appointment => appointment.status === 'STATUS_PRESCRIBED_ARCHIVED').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Archived</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />
                      <StyledTableCell>Full name</StyledTableCell>
                      <StyledTableCell>Medical Specialty</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPrescriptions
                      .filter(appointment => appointment.status === 'STATUS_PRESCRIBED_ARCHIVED')
                      .map(appointment => (
                        <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
        </TableContainer>
      )}
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', maxWidth: { xs: screenWidth, sm: screenWidth } }}
      >
        {userAllocations.length > 0 && (
          <Tabs
            variant="scrollable"
            value={selectedMedicalSpecialty}
            onChange={handleMedicalSpecialtyChange}
            aria-label="Medical Specialties"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {userAllocations.map((userAllocation) => (
              <Tab label={userAllocation.medicalSpecializationName} key={userAllocation._id} />
            ))}
          </Tabs>
        )}
      </Box>
      {selectedMedicalSpecialty != null && userAllocations.length > 0 && (
        <Paper>
          {filteredAppointments && (
            <TableContainer component={Paper}>
              <SearchBar onSearch={onSearchChange} value={filteredAppointments} text={'Appointments Queue'} />
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell>Position</StyledTableCell>
                    <StyledTableCell>Full name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .filter(appointment => appointment.status === 'STATUS_CONFIRMED')
                    .map(appointment => (
                      <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                    ))}
                </TableBody>
              </Table>
              <Typography style={{ marginLeft: '20px' }} variant="h5" mt={5} display="block" gutterBottom>Not present</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell>Full name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .filter(appointment => appointment.status === 'STATUS_CONFIRMED_ARCHIVED')
                    .map(appointment => (
                      <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </div>
  );
};

export default HomeForm;
