import React, { useState, useEffect } from 'react';
import { tdClient} from '../tdclient';
import { Tabs, TabList,TabPanels, TabPanel,Tab, TabIndicator, Flex, Text, Icon, Box } from '@chakra-ui/react';
import { IoImageOutline ,IoCloudOutline, IoCloudUploadOutline, IoPersonOutline } from "react-icons/io5";
import PhotosPage from './tabs/PhotosPage';
import DrivePage from './tabs/DrivePage';
import UploadPage from './tabs/UploadPage';
import ProfilePage from './tabs/ProfilePage';

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
        <div>
            <Flex
      position="fixed"
      width="100%"
      height="93%"
      flexDirection="column"
      alignItems="center"
      bg="white"
      p="4"
    >
      <Text as="h2" fontWeight="bold" mb="4">
        Logged in as {userName}
      </Text>
      <Tabs overflow="scroll" display="flex" flexDirection="column" flex="1" position="relative" variant="unstyled" width="100%">
        <TabPanels flex="1">
          <TabPanel>
            <PhotosPage/>
          </TabPanel>
          <TabPanel>
            <DrivePage/>
          </TabPanel>
          <TabPanel>
            <UploadPage/>
          </TabPanel>
          <TabPanel>
            <ProfilePage/>
          </TabPanel>
        </TabPanels>
        <Box width="100%" bottom="0" position="fixed" mb="1">
        <TabList width="100%">
          <Tab flex="1">
            <Icon as={IoImageOutline} w={6} h={6} />
          </Tab>
          <Tab flex="1">
            <Icon as={IoCloudOutline} w={6} h={6} />
          </Tab>
          <Tab flex="1">
            <Icon as={IoCloudUploadOutline} w={6} h={6} />
          </Tab>
          <Tab flex="1">
            <Icon as={IoPersonOutline} w={6} h={6} />
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="orange.400" borderRadius="1px" />
        </Box>
        
      </Tabs>
    </Flex>
        </div>
        
    );
};

export default Home;