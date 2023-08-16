const fs = require('fs');

const versionPath = './version.json';

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const updateVersion = async () => {
  try {
    const data = await readFile(versionPath);
    const versionObj = JSON.parse(data);
    const { buildVersion } = versionObj;
    const [major, minor, patch] = buildVersion.split('.').map(Number);

    const newVersion = `${major}.${minor}.${patch + 1}`;

    versionObj.buildVersion = newVersion;

    await writeFile(versionPath, JSON.stringify(versionObj, null, 2));
    console.log('Build version updated successfully');
  } catch (err) {
    console.error('Failed to update build version:', err);
    process.exit(1);
  }
};

updateVersion();