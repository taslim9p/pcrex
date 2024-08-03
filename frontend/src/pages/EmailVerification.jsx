import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const [status, setStatus] = useState('Verifying...');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    axios.get(`/api/v1/auth/verify?id=${id}`)
      .then(response => {
        setStatus('Email verified successfully!');
      })
      .catch(error => {
        setStatus('Verification failed. Please try again.');
      });
  }, [location.search]);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default EmailVerification;
