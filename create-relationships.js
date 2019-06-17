const {getDataPromise, writeFile} = require('./helpers');

const createRelationships = async () => {
  const words = await getDataPromise('words', true);
  let peopleData = {};

  Object.entries(words).forEach(([wordFileName, {data} = {}]) => {
    const {authors = [], title} = data;
    if (title) {
      authors
        .map(({author}) => ({
          author: author
            .trim()
            .toLowerCase()
            .split(' ')
            .join('-'),
        }))
        .filter(({author}) => !!author)
        .forEach(({author}) => {
          if (!peopleData[author]) {
            peopleData[author] = [];
          }

          peopleData[author].push(title);
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
      getDataPromise(`${__dirname}/data/people/${fileName}`)
        .then(personData => {
          personData.words = wordsList;
          writeFile('people', fileName, personData);
        })
        .catch(err => {});
    }
  });
};

createRelationships();
