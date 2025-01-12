import React, {useEffect} from 'react';
import Login from './components/Login';
import {ChakraProvider} from '@chakra-ui/react'
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor} from '@capacitor/core';

function App() {
  useEffect(() => {
    const setStatusBar = async () => {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' }); // Set this to match your app's background color
    };
    if (!Capacitor.getPlatform('web')) {
      setStatusBar();
    }
  }, []);

  return (
    <ChakraProvider>
        <div className="App">
            <Login/>
        </div>
    </ChakraProvider>
  );
}

export default App;
