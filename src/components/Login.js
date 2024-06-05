import React, { useState, useEffect } from 'react';
import { tdClient, setTdlibParameters, checkDatabaseEncryptionKey } from '../tdclient';
import { Button, ButtonGroup } from '@chakra-ui/react'

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState('phone'); // 'phone' or 'code'

  useEffect(() => {
    const initializeTdLib = async () => {
      await setTdlibParameters();
      await checkDatabaseEncryptionKey();
    };

    initializeTdLib();
  }, []);

  const handleSendCode = async () => {
    try {
      await tdClient.send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: phoneNumber
      });
      setStage('code');
    } catch (error) {
      console.error('Error sending phone number:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await tdClient.send({
        '@type': 'checkAuthenticationCode',
        code
      });
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      {stage === 'phone' ? (
        <div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <Button onClick={handleSendCode} colorScheme='blue'>Send Code </Button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
