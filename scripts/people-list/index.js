const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { "peoplelist": oldData }
} = require("../old.json");

oldData = changeImage(oldData);

const newData = {};

newData.title = oldData.name;

newData.header = {};
newData.header.image = oldData.header_image.url;
newData.header.menuColour = changeColour(oldData.colour_scheme);

newData.subtitle = {};
newData.subtitle.subtitle = '';
newData.subtitle.image = '';

newData.deck = {};
newData.deck.title = '';
newData.deck.paragraph = oldData.summary_content;
newData.deck.colour = changeColour(oldData.colour_scheme);

newData.optionalContent = 'people';

fs.writeFileSync('./data/pages/people.json', JSON.stringify(newData, null, 2), 'utf8');