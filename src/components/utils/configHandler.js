import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export async function writeToConfig(key, value) {
  const filePath = 'config.json';

  try {
    // Read the existing configuration file
    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    const configData = JSON.parse(result.data);
    configData[key] = value;

    // Write the updated configuration back to the file
    await Filesystem.writeFile({
      path: filePath,
      data: JSON.stringify(configData),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    console.log('Configuration updated with new key-value pair.');
  } catch (error) {
    if (error.message.includes('File does not exist')) {
      // If the file does not exist, create it with the new key-value pair
      const configData = { [key]: value };

      await Filesystem.writeFile({
        path: filePath,
        data: JSON.stringify(configData),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('Configuration file created with new key-value pair.');
    } else {
      console.error('Error writing config file:', error);
    }
  }
}

export async function readFromConfig(key) {
  const filePath = 'config.json';
  try {
    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    const configData = JSON.parse(result.data);

    return configData.hasOwnProperty(key) ? configData[key] : null;
  } catch (error) {
    if (error.message.includes('File does not exist')) {
      return null;
    } else {
      console.error('Error reading config file:', error);
      return null;
    }
  }
}