const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { "events": oldData }
} = require("../old.json");

oldData = changeImage(oldData);
Object.keys(oldData).forEach(key => {
  const event = oldData[key];
  const newEvent = {};

  newEvent.title = event.name;
  newEvent.image = event.title_image.url;
  newEvent.header = {};
  newEvent.header.menuColour = event.colour_scheme;
  newEvent.dateTime = event.start_date;
  newEvent.deck = event.events_list_summary;
  newEvent.article = event.article;

  const title = newEvent.title.toLowerCase().split('%40').join('@').split('%20').join('-').trim().split(' ').join('-');
  fs.writeFileSync(`./data/events/${title}.json`, JSON.stringify(newEvent, null, 2), 'utf8');
});