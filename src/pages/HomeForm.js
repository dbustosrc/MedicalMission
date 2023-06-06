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

  //Collapsible table
  const [isCollapseOpen, setIsCollapseOpen] = useState(true);

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
  }, [appointmentParams, reloadTable]);

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
          label="Clinics"
          onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        >
          {isCollapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          <Typography variant="h5" component="span">
            Clinics
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
        {userPharmacyAllocation.map((userAllocation) => (
          <Tabs
            variant="scrollable"
            //value={selectedMedicalSpecialty}
            //onChange={handleMedicalSpecialtyChange}
            //aria-label="Medical Specialties"
            scrollButtons="auto"
          >
            <Tab label={userAllocation.medicalSpecializationName} key={userAllocation._id} />
          </Tabs>
        ))}
        {userAllocations.length > 0 && (
          <Tabs
            variant="scrollable"
            value={selectedMedicalSpecialty}
            onChange={handleMedicalSpecialtyChange}
            aria-label="Medical Specialties"
            scrollButtons="auto"
          >
            {userAllocations.map((userAllocation) => (
              <Tab label={userAllocation.medicalSpecializationName} key={userAllocation._id} />
            ))}
          </Tabs>
        )}
      </Box>
      {selectedMedicalSpecialty != null && (
        <TableContainer component={Paper}>
          {filteredAppointments
            .filter(appointment => appointment.status === 'STATUS_ON-HOLD').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Appointments Queue</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />
                      <StyledTableCell>Appointment Number</StyledTableCell>
                      <StyledTableCell>Full name</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments
                      .filter(appointment => appointment.status === 'STATUS_ON-HOLD')
                      .map(appointment => (
                        <Row key={appointment._id} row={appointment} handleReloadTable={handleReloadTable} />
                      ))}
                  </TableBody>
                </Table>
              </>
            )}
          {filteredAppointments
            .filter(appointment => appointment.status === 'STATUS_ON-HOLD_ARCHIVED').length > 0 && (
              <>
                <Typography variant='h5' mt={5} display="block" gutterBottom>Archived</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />
                      <StyledTableCell>Appointment Number</StyledTableCell>
                      <StyledTableCell>Full name</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments
                      .filter(appointment => appointment.status === 'STATUS_ON-HOLD_ARCHIVED')
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
    number: PropTypes.number.isRequired,
    personName: PropTypes.string,
    attentionDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    observation: PropTypes.string,
  }).isRequired,
};

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
      const appointmentResponse = await axios.put(`${appointmentsUrl}/${appointmentParams._id}`, appointmentStatus, {
        headers: {
          Authorization: user
        }
      });
      console.log(appointmentResponse);
      props.handleReloadTable();
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
        <TableCell component="th" scope="row">
          {row.number}
        </TableCell>
        <TableCell>{row.personName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                Observation: {row.observation}
              </Typography>
              {row.status === 'STATUS_ON-HOLD' && (
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
                          status: 'STATUS_ON-HOLD_ARCHIVED',
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
              {row.status === 'STATUS_ON-HOLD_ARCHIVED' && (
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
                          status: 'STATUS_ON-HOLD',
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
