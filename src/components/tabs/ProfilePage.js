import React, {useState, useEffect } from 'react'
import { Text} from '@chakra-ui/react';
import { tdClient} from '../../tdclient';

export default function ProfilePage() {
  const [userName, setUserName] = useState('');
    useEffect(() => {
        const getUser = async () => {
            const user = await tdClient.send({
                '@type': 'getMe'
            });
            setUserName(user["first_name"]+user["last_name"]);
        }    
        getUser();
    }, []);
  return (
    <Text as="h2" fontWeight="bold" mb="4">
        Logged in as {userName}
      </Text>
  )
}
