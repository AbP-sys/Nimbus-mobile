import React, {useState, useEffect} from 'react';
import { Tabs, TabList,TabPanels, TabPanel,Tab, TabIndicator, Flex, Icon, Box, Image } from '@chakra-ui/react';
import { IoImageOutline ,IoCloudOutline, IoCloudUploadOutline, IoPersonOutline } from "react-icons/io5";
import { FiHardDrive } from "react-icons/fi";
import PhotosPage from './tabs/PhotosPage';
import DrivePage from './tabs/DrivePage';
import UploadPage from './tabs/UploadPage';
import ProfilePage from './tabs/ProfilePage';
import {tdClient} from '../tdclient';

const Home = () => {
    const logoUrl = "nimbus-logo.png";
    const [photosChatId, setPhotosChatId] = useState();

    async function getPhotosChatId() {
      if (process.env.REACT_APP_NIMBUSPHTOTS_ID){
        return process.env.REACT_APP_NIMBUSPHTOTS_ID
      }
      else {
        const searchResponse = await tdClient.send({
          '@type': 'searchChatsOnServer',
          'query': "NimbusPhotos",
          'limit': 1
        });
        return searchResponse.chat_ids[0];
      }    
    }

    useEffect(() => {
      const fetchChatId = async () => {
        try {
          const photosId = await getPhotosChatId();
          setPhotosChatId(photosId);
        } catch (error) {
          console.error('Error fetching chat ID:', error);
        }
      };
  
      fetchChatId();
    }, []);

    return (
        <div>
          <Flex position="fixed" width="100%" height="96%" flexDirection="column" alignItems="center" bg="white" p="4">
            <Tabs overflow="scroll" display="flex" flexDirection="column" flex="1" position="relative" variant="unstyled" width="100%">
              <Box height="10%" width="40%">
                <Image src={logoUrl} alt="nimbus-logo"/>
              </Box>
              <TabPanels flex="1">
                <TabPanel>
                {photosChatId ? (<PhotosPage chatId={photosChatId} />) : (  <p>Loading chat...</p>)}
                </TabPanel>
                <TabPanel>
                  <DrivePage/>
                </TabPanel>
                <TabPanel>
                  {photosChatId ? (<UploadPage chatId={photosChatId} />) : (  <p>Loading chat...</p>)}
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
                    <Icon as={FiHardDrive} w={6} h={6} />
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