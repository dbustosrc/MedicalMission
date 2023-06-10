import axios from 'axios';
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { API_BASE_URL } from '../config';

import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Grid, FormControl, Autocomplete, TextField, Table, TableCell, TableBody, TableHead, TableRow, Paper, TableContainer, Typography, Button } from "@mui/material/";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tableCellClasses } from '@mui/material/TableCell';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckIcon from '@mui/icons-material/Check';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Collapse from '@mui/material/Collapse';

import dayjs from 'dayjs';

const userAllocationsUrl = API_BASE_URL.URI + 'users-allocations';
const periodsUrl = API_BASE_URL.URI + 'periods';
const appointmentsUrl = API_BASE_URL.URI + 'appointments';

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

const HomeForm = () => {
  const navigate = useNavigate();
  const { user, userId } = useAuth();
  const [value, setValue] = useState(0);
  //Appointments
  const [appointmentParams, setAppointmentParams] = useState({
    period: '',
    attentionDate: '',
    medicalSpecialty: '',
  });
  const [filteredAppointments, setFilteredAppointments] = useState([]);
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
        console.log(response);
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
        console.log(response);
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
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', maxWidth: { xs: screenWidth, sm: screenWidth }}}
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
        <TableContainer component={Paper}>
          {filteredAppointments
            .filter(appointment => appointment.status === 'STATUS_CONFIRMED').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Appointments Queue</Typography>
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
              </>
            )}
          {filteredAppointments
            .filter(appointment => appointment.status === 'STATUS_CONFIRMED_ARCHIVED').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Archived</Typography>
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
              </>
            )}
        </TableContainer>
      )}
    </div>
  );
};

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
    otherAppointments: PropTypes.arrayOf(
      PropTypes.shape({
        medicalSpecializationName: PropTypes.string,
        attentionDate: PropTypes.string,
        status: PropTypes.string,
      }),
    ),
  }).isRequired,
};

function Row(props, comp) {
  const { user } = useAuth();
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [appointmentParams, setAppointmentParams] = useState({
    _id: '',
    status: '',
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
      //console.log(appointmentParams);
    }
  }, [appointmentParams]);

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
        {row.position && (
          <TableCell>{row.position}</TableCell>
        )}
        <TableCell component="th" scope="row">{row.personName}</TableCell>
        {row.medicalSpecializationName && (
          <TableCell>{row.medicalSpecializationName}</TableCell>
        )}
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
                    <TableCell>ID Card</TableCell>
                    <TableCell>Identification</TableCell>
                    <TableCell>Observation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.idCardNumber}>
                    <TableCell component="th" scope="row">
                      {row.idCardNumber}
                    </TableCell>
                    <TableCell>{row.identification}</TableCell>
                    <TableCell>{row.observation}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {row.otherAppointments?.length > 0 && (
                <div>
                  <Typography variant="h6" gutterBottom component="div">
                    Other Appointments
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Specialty</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Attend</TableCell>
                        <TableCell>Prescribe</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.otherAppointments.map(otherAppointment => (
                        <TableRow key={otherAppointment.idCardNumber}>
                          <TableCell component="th" scope="row">
                            {otherAppointment.medicalSpecializationName}
                          </TableCell>
                          <TableCell>{otherAppointment.status}</TableCell>
                          <TableCell>
                            {otherAppointment.status === 'STATUS_CONFIRMED' && (
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                size="large"
                                startIcon={<CheckIcon />}
                                onClick={(event, newValue) => {
                                  setAppointmentParams({
                                    ...appointmentParams,
                                    status: 'STATUS_ATTENDED',
                                    _id: otherAppointment._id
                                  });
                                }}
                                sx={{
                                  mt: "10px",
                                  color: "#ffffff",
                                  backgroundColor: "#d01716",
                                  width: "100%",
                                }}
                              >
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            {otherAppointment.status === 'STATUS_CONFIRMED' && (
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                size="large"
                                startIcon={<ReceiptLongIcon />}
                                onClick={(event, newValue) => {
                                  setAppointmentParams({
                                    ...appointmentParams,
                                    status: 'STATUS_PRESCRIBED',
                                    _id: otherAppointment._id
                                  });
                                }}
                                sx={{
                                  mt: "10px",
                                  color: "#ffffff",
                                  backgroundColor: "#d01716",
                                  width: "100%",
                                }}
                              >
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {row.status === 'STATUS_PRESCRIBED' && (
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
                          status: 'STATUS_ATTENDED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Attended
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      startIcon={<ArchiveIcon />}
                      onClick={(event, newValue) => {
                        setAppointmentParams({
                          ...appointmentParams,
                          status: 'STATUS_PRESCRIBED_ARCHIVED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Archive
                    </Button>
                  </Grid>
                </Grid>
              )}
              {row.status === 'STATUS_PRESCRIBED_ARCHIVED' && (
                <Grid container spacing={0} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      startIcon={<UnarchiveIcon />}
                      onClick={(event, newValue) => {
                        setAppointmentParams({
                          ...appointmentParams,
                          status: 'STATUS_PRESCRIBED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Unarchive
                    </Button>
                  </Grid>
                </Grid>
              )}
              {row.status === 'STATUS_CONFIRMED' && (
                <Grid container spacing={0} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      startIcon={<ReceiptLongIcon />}
                      onClick={(event, newValue) => {
                        setAppointmentParams({
                          ...appointmentParams,
                          status: 'STATUS_PRESCRIBED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Prescribed
                    </Button>
                  </Grid>
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
                          status: 'STATUS_ATTENDED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Attended
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      startIcon={<ArchiveIcon />}
                      onClick={(event, newValue) => {
                        setAppointmentParams({
                          ...appointmentParams,
                          status: 'STATUS_CONFIRMED_ARCHIVED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Archive
                    </Button>
                  </Grid>
                </Grid>
              )}
              {row.status === 'STATUS_CONFIRMED_ARCHIVED' && (
                <Grid container spacing={0} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <Grid item xs={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth={true}
                      size="large"
                      startIcon={<UnarchiveIcon />}
                      onClick={(event, newValue) => {
                        setAppointmentParams({
                          ...appointmentParams,
                          status: 'STATUS_CONFIRMED',
                          _id: row._id
                        });
                      }}
                      sx={{
                        mt: "10px",
                        color: "#ffffff",
                        backgroundColor: "#d01716",
                        width: "100%",
                      }}
                    >
                      Unarchive
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>

          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default HomeForm;
