import React, { useState, useEffect } from 'react';
import { tdClient} from '../tdclient';

const Home = () => {
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
        <h2>Logged in as {userName}</h2>
    );
};

export default Home;