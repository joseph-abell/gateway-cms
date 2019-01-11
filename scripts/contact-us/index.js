const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { "contactus": oldData }
} = require("../old.json");

oldData = changeImage(oldData);

const newData = {};

newData.title = oldData.name;
newData.image = oldData.header_image.url;
newData.menuColour = changeColour(oldData.colour_scheme);
newData.contentImage = oldData.filler_image.url;
newData.deck = oldData.email_description;

fs.writeFileSync('./data/contact-us.json', JSON.stringify(newData, null, 2), 'utf8');