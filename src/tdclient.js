import TdClient from 'tdweb';

export const tdClient = new TdClient({
  logVerbosityLevel: 1,
  jsLogVerbosityLevel: 'info',
  mode: 'wasm'
});

export const setTdlibParameters = async () => {
  try {
    await tdClient.send({
      '@type': 'setTdlibParameters',
      parameters: {
        '@type': 'tdlibParameters',
        use_test_dc: false,
        database_directory: 'tdlib',
        files_directory: 'tdlib',
        use_file_database: false,
        use_chat_info_database: false,
        use_message_database: true,
        use_secret_chats: true,
        api_id: process.env.REACT_APP_API_ID, 
        api_hash: process.env.REACT_APP_API_HASH,
        system_language_code: 'en',
        device_model: 'Desktop',
        system_version: 'Unknown',
        application_version: '1.0',
        enable_storage_optimizer: true,
        ignore_file_names: false
      }
    });
  } catch (error) {
    console.error('Error setting TDLib parameters:', error);
  }
};

export const checkDatabaseEncryptionKey = async (encryptionKey = '') => {
  try {
    await tdClient.send({
      '@type': 'checkDatabaseEncryptionKey',
      encryption_key: encryptionKey
    });
  } catch (error) {
    console.error('Error checking database encryption key:', error);
  }
};
