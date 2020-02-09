const fs = require('fs');
const path = require('path');

const getDataFromIndexFile = (filename) => {
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  const values = JSON.stringify(Object.values(data), null, 2);
  let writeFilename = filename.split('/').slice(0,-1).join('/');
  writeFilename = `${writeFilename}/index-list.json`;
  fs.writeFileSync(writeFilename, values, 'utf-8');
}

const indexFiles = [
  './data/events/index.json',
  './data/pages/index.json',
  './data/people/index.json',
  './data/peopleFilters/index.json',
  './data/words/index.json',
]

indexFiles.forEach(file => {
  getDataFromIndexFile(file);
})
