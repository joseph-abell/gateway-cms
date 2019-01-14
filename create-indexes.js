const {
  getDataPromise,
  getFileNamesPromise,
  writeFile,
  flatten,
} = require('./helpers');

const getFileNames = async pageTypes => {
  // We have a lot of different page types to create index files for.
  // We need to get the file names for all of them. Getting the filenames
  // is an asynchronous call, which means we will need to make the getData
  // function promise us that it will return each file name.

  // When we have the promises for each file name, we group them together
  // so we have a list of promises. Then, we can tell javascript to let us
  // know when all the promises are completed. This should give us a list
  // of file names.

  // What we actually get is a list of lists of filenames, like this.
  // [
  //   [ 'File1', 'File2' ],
  //   [ 'File 3', 'File 4', 'File 5']
  // ]

  // We want it to look like this:
  // [ 'File 1', 'File 2', 'File 3', 'File 4', 'File 5' ]

  // The flatten function does this for us.

  // Next, we want to make sure that when we run this code a second time,
  // it ignores any index files that have already been created by this
  // program. We use the filter method to give us a list of data that
  // does not come from an index.json file.

  const promises = [];

  pageTypes.forEach(type => {
    promises.push(getFileNamesPromise(type));
  });

  const fileNames = await Promise.all(promises);

  return flatten(fileNames).filter(file => !file.includes('index.json'));
};

const buildFileStructure = async fileNames => {
  // We need a fileStructure, to link together the data we are getting later
  // with the filename and the type of content the data is. Without the
  // fileStructure, we wouldn't know whether the data is an event, or what url
  // the data links to.

  // What I want is a list of items that look like this:
  // { type: 'Event', url: 'https://link.to.content', data: {} }

  // That way I know which index file I need to save each data to.
  const fileStructure = {};

  fileNames.forEach(async fileName => {
    const splitName = fileName.split('/');
    const type = splitName[splitName.length - 2];
    const appendix = splitName[splitName.length - 1];
    const url = `https://gateway-cms.netlify.com/data/${type}/${appendix}`;

    fileStructure[appendix] = {
      url,
      type,
      data: getDataPromise(fileName),
    };
  });

  return fileStructure;
};

const addDataToFileStructure = async fileStructure => {
  // Now we have a data structure we use, we do what we did in
  // getFileNames - we make a list of promises. This time, we
  // want to get the data in each file. We use the list of keys
  // in the file structure, and use them to make the list of
  // promises. We then wait until all the promises resolve, giving
  // us the data from every file in a list.

  // From there, we find the matching file in our file structure,
  // and add the data to the file structure. Now we should have
  // everything we need to create the index files.
  const keys = Object.keys(fileStructure);
  const promises = keys.map(item => fileStructure[item].data);
  const data = await Promise.all(promises);

  data.forEach(item => {
    const keys = Object.keys(fileStructure);
    keys.forEach(key => {
      if (
        `${item.title
          .split('(')
          .join('')
          .split(')')
          .join('')
          .split('%26')
          .join('')
          .split('&')
          .join('')
          .split(',')
          .join('')
          .split("'")
          .join('')}.json` === key
      ) {
        fileStructure[key].data = item.json;
      }
    });
  });

  return fileStructure;
};

const buildIndexFiles = fileStructure => {
  const result = {};
  Object.keys(fileStructure).forEach(item => {
    result[fileStructure[item].type] = result[fileStructure[item].type] || {};
    result[fileStructure[item].type][item] = fileStructure[item];
  });
  return result;
};

const saveIndexFiles = (pageTypes, indexPages) => {
  pageTypes.forEach(type => {
    writeFile(type, 'index.json', indexPages[type]);
  });
};

const createIndexes = async () => {
  const pageTypes = ['events', 'pages', 'people', 'peopleFilters', 'words'];
  const fileNames = await getFileNames(pageTypes);
  let fileStructure = await buildFileStructure(fileNames);
  fileStructure = await addDataToFileStructure(fileStructure);
  const indexFiles = buildIndexFiles(fileStructure);
  saveIndexFiles(pageTypes, indexFiles);
};

createIndexes();
