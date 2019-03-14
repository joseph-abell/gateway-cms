const {getDataPromise, writeFile} = require('./helpers');

const createRelationships = async () => {
  const words = await getDataPromise('words', true);
  let peopleData = {};

  Object.entries(words).forEach(([wordFileName, {data} = {}]) => {
    const {authors, title} = data;
    if (authors) {
      authors
        .filter(({author}) => author && author.trim().length > 0)
        .forEach(({author = 'caleb-ellwood'}) => {
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
    const personData = await getDataPromise(
      `${__dirname}/data/people/${fileName}`,
    );
    personData.json.words = wordsList;
    writeFile('people', fileName, personData);
  });
};

createRelationships();
