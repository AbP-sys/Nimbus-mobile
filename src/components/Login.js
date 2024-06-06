import React, { useState, useEffect } from 'react';
import { tdClient, setTdlibParameters, checkDatabaseEncryptionKey } from '../tdclient';
import { Input, Button, Spinner, Flex } from '@chakra-ui/react';
import Home from './Home';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [authorizationState, setAuthorizationState] = useState('');

  useEffect(() => {
    const getAuthorizationState = async () => {
      setAuthorizationState(await tdClient.send({
        '@type': 'getAuthorizationState'
      }));  
    }; 

    const initializeTdLib = async () => {
      await setTdlibParameters();
    }

    const sendDatabaseEncryptionKey = async () => {
      await checkDatabaseEncryptionKey();
    }

    switch (authorizationState['@type']) {
      case 'authorizationStateWaitTdlibParameters':
          initializeTdLib();
          break;
      case 'authorizationStateWaitEncryptionKey':
          sendDatabaseEncryptionKey();
          break;
      case 'authorizationStateWaitPhoneNumber': {
          break;
      }
      case 'authorizationStateWaitCode':
          break;
    }        
    
    getAuthorizationState();
    
  }, [authorizationState]);

  const handleSendCode = async () => {
    try {
      await tdClient.send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: phoneNumber
      });
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

  const pageDisplay = (state) => {
    switch(state){
      case 'authorizationStateReady': {
        return(<Home/>);
      }
      case 'authorizationStateWaitPhoneNumber': {
        return(
          <Flex align="center" p="4">
            <Input type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              p="2"
              mr="4"/>
            <Button onClick={handleSendCode} colorScheme='blue'>Send Code </Button>
          </Flex>
        );
      }
      case 'authorizationStateWaitCode': {
        return (
          <Flex align="center" p="4">
            <Input type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              p="2"
              mr="4"/>
            <Button onClick={handleLogin} colorScheme='blue'>Login</Button>
          </Flex>
        );
      }
          
      default:
        return (
          <Spinner color='blue.500' />
        );
    }
  }

  return (
    <div>
      {pageDisplay(authorizationState['@type'])}
    </div>
    );    
};

export default Login;
