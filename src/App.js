import React from 'react';
import Login from './components/Login';
import {ChakraProvider} from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
        <div className="App">
            <Login/>
        </div>
    </ChakraProvider>
  );
}

export default App;
