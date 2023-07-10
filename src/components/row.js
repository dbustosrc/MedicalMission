import axios from 'axios';
import { useEffect, useState, Fragment } from "react";
import { API_BASE_URL } from '../config';
import PropTypes from 'prop-types';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { useAuth } from "../context/Auth";
import { Box, Grid, Table, TableCell, TableBody, TableHead, TableRow, Typography, Button } from "@mui/material/";
import StyledTableCell from './styledtablecell';
import StatusIcon, { AppointmentStatus } from '../components/statusicon';
import RowButtons from './rowbuttons';

const appointmentsUrl = API_BASE_URL.URI + 'appointments';

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
    relatedAppointments: PropTypes.arrayOf(
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
        await axios.put(`${appointmentsUrl}/${appointmentParams._id}`, appointmentStatus, {
          headers: {
            Authorization: user
          }
        });
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
  }, [appointmentParams]);

  return (
    <Fragment>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
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
              <Typography variant="h6" gutterBottom component="div">Appointment detail</Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID Card</StyledTableCell>
                    <StyledTableCell>Identification</StyledTableCell>
                    <StyledTableCell>Reason</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.idCardNumber}>
                    <TableCell component="th" scope="row">{row.idCardNumber}</TableCell>
                    <TableCell>{row.identification}</TableCell>
                    <TableCell>{row.observation}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <RowButtons _id={row._id} status={row.status} setAppointmentParams={setAppointmentParams} />
              {row.relatedAppointments?.length > 0 && (
                <div>
                  <Typography variant="h6" gutterBottom component="div">Related Appointments</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Specialty</StyledTableCell>
                        <StyledTableCell>Reason</StyledTableCell>
                        <StyledTableCell>Attend</StyledTableCell>
                        <StyledTableCell>Prescribe</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.relatedAppointments.map(otherAppointment => (
                        <TableRow key={otherAppointment.idCardNumber}>
                          <TableCell><StatusIcon status={otherAppointment.status}></StatusIcon></TableCell>
                          <TableCell component="th" scope="row">{otherAppointment.medicalSpecializationName}</TableCell>
                          <TableCell>{otherAppointment.observation}</TableCell>
                          <TableCell>
                            {otherAppointment.status === AppointmentStatus.CONFIRMED && (
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                size="large"
                                startIcon={<StatusIcon status={AppointmentStatus.ATTENDED} />}
                                onClick={(event, newValue) => {
                                  setAppointmentParams({
                                    ...appointmentParams,
                                    status: AppointmentStatus.ATTENDED,
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
                            {otherAppointment.status === AppointmentStatus.CONFIRMED && (
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth={true}
                                size="large"
                                startIcon={<StatusIcon status={AppointmentStatus.PRESCRIBED} />}
                                onClick={(event, newValue) => {
                                  setAppointmentParams({
                                    ...appointmentParams,
                                    status: AppointmentStatus.PRESCRIBED,
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default Row;