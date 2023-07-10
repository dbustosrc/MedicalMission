import { useEffect, useState } from "react";
import { Grid, Button } from "@mui/material/";
import StatusIcon, { AppointmentStatus, AppointmentStatusMap, getStatusKey } from '../components/statusicon';
import { Unarchive } from "@mui/icons-material";

const RowButtons = (props) => {
    const [buttons, setButtons] = useState([{
        _id: props._id,
        status: props.status,
        nextStatus: '',
        icon: null,
        text: '',
    }]);

    const buttonsBuilder = async (status) => {
        switch (status) {
            case AppointmentStatus.PRESCRIBED:
                setButtons([
                    {
                        ...buttons[0],
                        status: AppointmentStatus.PRESCRIBED,
                        nextStatus: AppointmentStatus.ATTENDED,
                        icon: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.ATTENDED)).icon,
                        text: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.ATTENDED)).description,
                    },
                    {
                        ...buttons[0],
                        status: AppointmentStatus.PRESCRIBED,
                        nextStatus: AppointmentStatus.PRESCRIBED_ARCHIVED,
                        icon: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.PRESCRIBED_ARCHIVED)).icon,
                        text: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.PRESCRIBED_ARCHIVED)).description,
                    }
                ]);
                break;
            case AppointmentStatus.CONFIRMED:
                setButtons([
                    {
                        ...buttons[0],
                        status: AppointmentStatus.CONFIRMED,
                        nextStatus: AppointmentStatus.PRESCRIBED,
                        icon: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.PRESCRIBED)).icon,
                        text: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.PRESCRIBED)).description,
                    },
                    {
                        ...buttons[0],
                        status: AppointmentStatus.PRESCRIBED,
                        nextStatus: AppointmentStatus.ATTENDED,
                        icon: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.ATTENDED)).icon,
                        text: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.ATTENDED)).description,
                    },
                    {
                        ...buttons[0],
                        status: AppointmentStatus.PRESCRIBED,
                        nextStatus: AppointmentStatus.CONFIRMED_ARCHIVED,
                        icon: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.CONFIRMED_ARCHIVED)).icon,
                        text: AppointmentStatusMap.get(getStatusKey(AppointmentStatus.CONFIRMED_ARCHIVED)).description,
                    }
                ]);
                break;
                case AppointmentStatus.CONFIRMED_ARCHIVED:
                    setButtons([
                        {
                            ...buttons[0],
                            status: AppointmentStatus.CONFIRMED_ARCHIVED,
                            nextStatus: AppointmentStatus.CONFIRMED,
                            icon: <Unarchive/>,
                            text: 'Present',
                        }
                    ]);
                break;
                case AppointmentStatus.PRESCRIBED_ARCHIVED:
                    setButtons([
                        {
                            ...buttons[0],
                            status: AppointmentStatus.PRESCRIBED_ARCHIVED,
                            nextStatus: AppointmentStatus.PRESCRIBED,
                            icon: <Unarchive/>,
                            text: 'Present',
                        }
                    ]);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        buttonsBuilder(props.status);
    }, []); // Sin dependencias

    const hadleStatus = async (e) => {

    };

    return (
        <Grid container spacing={0} sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Grid item xs={6}>
                {buttons.map(button => (
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        startIcon={button.icon}
                        onClick={(event, newValue) => {
                            props.setAppointmentParams({
                                ...props.appointmentParams,
                                status: button.nextStatus,
                                _id: button._id
                            });
                        }}
                        sx={{
                            mt: "10px",
                            color: "#ffffff",
                            backgroundColor: "#d01716",
                            width: "100%",
                        }}
                    >
                        {button.text}
                    </Button>
                ))}
            </Grid>
        </Grid>
    );
};

export default RowButtons;