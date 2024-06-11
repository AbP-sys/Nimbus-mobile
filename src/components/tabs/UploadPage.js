import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { tdClient} from '../../tdclient';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export default function UploadPage({chatId}) {
  const [uppy] = useState(() => new Uppy());
  
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            resolve(event.target.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
        fileReader.readAsArrayBuffer(file.data);
    });
  };

  const uploadFilesToTelegram = async (files) => {
    try {
        for (const file of files) {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const fileBuffer = new Uint8Array(arrayBuffer);
            const fileBlob = new Blob([fileBuffer], { type: file.type });
            console.log(fileBlob);

            const payload = {
              '@type': 'inputMessageDocument',
              document: { '@type': 'inputFileBlob', name: file.name, size: fileBlob.size , data: fileBlob }
            };
            console.log("uploading..");
              await tdClient.send({
                '@type': 'sendMessage',
                chat_id: chatId,
                reply_to_message_id: null,
                input_message_content: payload
              });
              console.log("sent");
        }
    } catch (error) {
        console.error('Error uploading files:', error);
    }
  };

  useEffect(() => {
    uppy.on('upload', (files) => {
      uploadFilesToTelegram(uppy.getFiles(files.id));
    });
    return () => uppy.close();
  }, [uppy]);
  
  return <Dashboard uppy={uppy} />;
}
