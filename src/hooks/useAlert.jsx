import { useState } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

const useAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const showAlert = (msg, severity = 'info') => {
    setMessage(msg);
    setSeverity(severity);
    setOpen(true);
  };

  const hideAlert = () => {
    setOpen(false);
  };

  const AlertComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hideAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert onClose={hideAlert} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );

  return { showAlert, AlertComponent };
};

export default useAlert;
