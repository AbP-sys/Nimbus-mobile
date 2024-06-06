import React from 'react';
import Login from './components/Login';
import { Flex, Text, ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
        <div className="App">
            <Flex alignItems="center" justifyContent="center">
                <Text fontWeight="bold" fontSize="xl"> Telegram Login </Text>
            </Flex>
            <Login/>
        </div>
    </ChakraProvider>
  );
}

export default App;
