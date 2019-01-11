const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: {words: oldData, people},
} = require('../old.json');

oldData = changeImage(oldData);
Object.keys(oldData).forEach(key => {
  const word = oldData[key];
  const newWord = {};

  newWord.authors = (word.authors || []).map(author => ({
    author: people[author.replace('people ', '')].name
      .toLowerCase()
      .split(' ')
      .join('-'),
  }));
  newWord.showOnPodcast = word.show_on_itunes;
  newWord.itunesImage = '/uploads/logo.jpg';
  newWord.deck = word.article;
  newWord.colour = changeColour(word.colour_scheme);
  newWord.date = word.publish_date;
  newWord.audioFile =
    word.media &&
    word.media[0] &&
    word.media[0].audio &&
    word.media[0].audio.url;
  newWord.subtitle = word.summary;
  newWord.title = word.name;
  newWord.image = word.summary_image.url;

  const title = newWord.title
    .toLowerCase()
    .split('.')
    .join()
    .split('?')
    .join('')
    .split(',')
    .join('')
    .split('!')
    .join('')
    .split('%40')
    .join('@')
    .split('%20')
    .join('-')
    .trim()
    .split(' ')
    .join('-')
    .split(':')
    .join('')
    .split('#')
    .join('');
  fs.writeFileSync(
    `./data/words/${title}.json`,
    JSON.stringify(newWord, null, 2),
    'utf8',
  );
});
