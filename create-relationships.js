const {getDataPromise, writeFile} = require('./helpers');

const createRelationships = async () => {
  const words = await getDataPromise('words', true);
  let peopleData = {};

  Object.entries(words).forEach(([wordFileName, {data} = {}]) => {
    const {authors, title} = data;
    if (authors) {
      authors
        .map(({author}) => ({author: (author || 'caleb-ellwood').trim()}))
        .forEach(({author}) => {
          if (!peopleData[author]) {
            peopleData[author] = [title];
          } else {
            peopleData[author].push(title);
          }
        });
    }
  });

  Object.entries(peopleData).forEach(async ([personName, wordsList]) => {
    const name = personName
      .toLowerCase()
      .split(' ')
      .join('-');
    const fileName = name.concat('.json');
    if (fileName !== '.json') {
      const personData = await getDataPromise(
        `${__dirname}/data/people/${fileName}`,
      );

      if (personData.json) {
        personData.json.words = wordsList;
      } else {
        personData.words = wordsList;
      }
      writeFile('people', fileName, personData);
    }
  });
};

createRelationships();
