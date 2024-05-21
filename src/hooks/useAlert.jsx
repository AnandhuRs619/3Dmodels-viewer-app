import { useState } from 'react';

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

  return { showAlert, hideAlert, message, severity, open };
};

export default useAlert;
