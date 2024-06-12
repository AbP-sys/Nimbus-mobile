import React, { useState, useEffect } from 'react';
import { tdClient} from '../../tdclient';
import {Box, SimpleGrid, Image} from '@chakra-ui/react';
import { decryptFile } from '../utils/encryption';

const PhotosPage = ({chatId, iv, encryptionKey}) => {
  const [documentIds, setDocumentIds] = useState([]);
  const [imgurls, setImgurls] = useState([]);
  const [lastFetchedMessageId, setLastFetchedMessageId] = useState(0);

  async function displayImage(file) {
    try {
     
  
      if (file.local.is_downloading_completed) {
        // File is already downloaded
        console.log("downloaded file: ", file);
        
        //const blob = await fetch(file.local.path).then(r => r.blob());
        const response = await tdClient.send({
          '@type': 'readFile',
          file_id: file.id
        });
        const encryptedArrayBuffer = await new Response(response.data).arrayBuffer();
        const decryptedArrayBuffer = await decryptFile(encryptedArrayBuffer, encryptionKey, iv);
        console.log("decrypt done...", decryptedArrayBuffer);
        const blob = new Blob([decryptedArrayBuffer], { type: file.type });

        const url = URL.createObjectURL(blob);
        console.log(url);
        imgurls.push(url);
        // Display the image
        /* const img = document.createElement('img');
        img.src = url;
        document.body.appendChild(img); */
        console.log("I have added the image"); 
      } else {
        // Handle file not yet downloaded
        console.log('File is not downloaded yet.');
      }
    } catch (error) {
      console.error('Error fetching or displaying the file:', error);
    }
  }

  const downloadFile = async (fileId) => {
    if(chatId) {
      console.log("downloading..")
      const file = await tdClient.send({
        '@type': 'downloadFile',
        'file_id': fileId,
        'priority': 32 // Priority for file download, 1-32
      });
  
      if (!file.local.is_downloading_completed) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            const updatedFile = await tdClient.send({
              '@type': 'getFile',
              'file_id': fileId
            });
  
            if (updatedFile.local.is_downloading_completed) {
              clearInterval(interval);
              resolve(updatedFile);
              displayImage(updatedFile);
            }
          }, 1000); // Check every 1 second
        });
      }
      return file;
    }
  };

  async function getDocumentIds(fromMessageId) {
    if(chatId) {
      const fetchedMessages = await tdClient.send({
        '@type': 'getChatHistory',
        'chat_id': chatId,
        'limit': 10,
        'from_message_id': fromMessageId
    });
    console.log("messages ",fetchedMessages);
    const fetchedDocumentIds = fetchedMessages["messages"].filter(msg => msg.content && msg.content['@type'] === 'messageDocument') //verify if message is document
                                .map(message => message["content"]["document"]["document"]["id"]);
    setLastFetchedMessageId(fetchedMessages["messages"][fetchedMessages["total_count"]-1]["id"]);
    setDocumentIds([...documentIds, ...fetchedDocumentIds]);
    }
  }  

  useEffect(() => {
    console.log("documentIds: ", documentIds);
    if(documentIds.length < 10) {
      getDocumentIds(lastFetchedMessageId);
    }
    const files = documentIds.map(async documentId => await downloadFile(documentId));
    console.log("file: ",files);
  }, [lastFetchedMessageId, chatId]);

  return (
    

      <Box p={5}>
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {imgurls.map((url, index) => (
            <Image key={index} src={url} alt={`Image ${index + 1}`} borderRadius="md" />
          ))}
        </SimpleGrid>
      </Box>
    
  );
};

export default PhotosPage;