import CheckIcon from '@mui/icons-material/Check';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BackHandIcon from '@mui/icons-material/BackHand';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SendIcon from '@mui/icons-material/Send';
import ArchiveIcon from '@mui/icons-material/Archive';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';

const AppointmentStatus = {
  ON_HOLD: 'STATUS_ON-HOLD',
  PRESENT: 'STATUS_PRESENT',
  CONFIRMED: 'STATUS_CONFIRMED',
  CONFIRMED_REFERAL: 'STATUS_CONFIRMED_REFERAL',
  CONFIRMED_ARCHIVED: 'STATUS_CONFIRMED_ARCHIVED',
  BEING_ATTENDED: 'STATUS_BEING-ATTENDED',
  AWAITING_RESULTS: 'STATUS_AWAITING-RESULTS',
  PRESCRIBED: 'STATUS_PRESCRIBED',
  PRESCRIBED_ARCHIVED: 'STATUS_PRESCRIBED_ARCHIVED',
  ATTENDED: 'STATUS_ATTENDED',
  NOT_ATTENDED: 'STATUS_NOT-ATTENDED',
};

const AppointmentStatusMap = new Map([
  ['ON-HOLD', {
    status: 'STATUS_ON-HOLD',
    description: 'On Hold',
    icon: <BackHandIcon />,
  }],
  ['PRESENT', {
    status: 'STATUS_PRESENT',
    description: 'Present',
    icon: <HowToRegIcon />,
  }],
  ['CONFIRMED', {
    status: 'STATUS_CONFIRMED',
    description: 'Confirmed',
    icon: <PendingActionsIcon />,
  }],
  ['CONFIRMED_REFERAL', {
    status: 'STATUS_CONFIRMED_REFERAL',
    description: 'Referal',
    icon: <SendIcon />,
  }],
  ['CONFIRMED_ARCHIVED', {
    status: 'STATUS_CONFIRMED_ARCHIVED',
    description: 'Not present',
    icon: <ArchiveIcon />,
  }],
  ['BEING-ATTENDED', {
    status: 'STATUS_BEING-ATTENDED',
    description: 'Being Attended',
    icon: <MonitorHeartIcon />,
  }],
  ['AWAITING-RESULTS', {
    status: 'STATUS_AWAITING-RESULTS',
    description: 'Awaiting Results',
    icon: <BloodtypeIcon />,
  }],
  ['PRESCRIBED', {
    status: 'STATUS_PRESCRIBED',
    description: 'Prescribed',
    icon: <ReceiptLongIcon />,
  }],
  ['PRESCRIBED_ARCHIVED', {
    status: 'STATUS_PRESCRIBED_ARCHIVED',
    description: 'Not present',
    icon: <ArchiveIcon />,
  }],
  ['ATTENDED', {
    status: 'STATUS_ATTENDED',
    description: 'Attended',
    icon: <CheckIcon />,
  }],
  ['NOT-ATTENDED', {
    status: 'STATUS_NOT-ATTENDED',
    description: 'Not Attended',
    icon: <CloseIcon />,
  }],
]);

const getStatusKey = (value) => {
  for (const key in AppointmentStatus) {
    if (AppointmentStatus.hasOwnProperty(key) && AppointmentStatus[key] === value) {
      return key;
    }
  }
  
  return null;
};

const StatusIcon = (props) => {

  const getStatusIcon = () => {
    const { status } = props;
    const statusKey = getStatusKey(status);
    if (AppointmentStatusMap.has(statusKey)) {
      return AppointmentStatusMap.get(statusKey).icon;
    }
  };

  return getStatusIcon();
};

export default StatusIcon;

export { AppointmentStatus, AppointmentStatusMap, getStatusKey };